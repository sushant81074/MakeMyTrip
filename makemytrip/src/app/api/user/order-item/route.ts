import { NextRequest, NextResponse } from "next/server";
import Order from "@/model/orders.model";
import HotelItems from "@/model/hotelItems.model";
import { ApiError } from "next/dist/server/api-utils";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import { checkValidUser } from "@/helper/checkValidUser";
import HotelBooking from "@/model/hotelBooking.model";
import { randomUUID } from "crypto";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      throw new ApiError(405, "Invalid request method");

    const itemId = request.nextUrl.searchParams.get("itemId");
    if (!itemId) throw new ApiError(400, "No item selected");

    const tokenData: any = await tokenDecrypter(request);
    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "Unauthorized user");

    const { valid, user }: any = await checkValidUser(tokenData);
    if (!valid) throw new ApiError(401, "Invalid user credentials");

    const { bookingId } = await request.json();
    if (!bookingId) throw new ApiError(400, "No booking ID provided");

    const itemExists = await HotelItems.findOne({ itemId });
    if (!itemExists)
      throw new ApiError(404, "Item selected not found in hotel's inventory");

    const hotelBookingExists = await HotelBooking.findOne({ bookingId });
    if (!hotelBookingExists) throw new ApiError(400, "Invalid booking ID");

    let order = await Order.findOne({
      bookingId,
      bookingRef: hotelBookingExists?.bookingRef,
    });

    const newOrderItem = {
      itemId: itemExists?.itemId,
      itemRef: itemExists?._id,
      price: itemExists?.price,
    };

    if (order) {
      order.orders.push(newOrderItem);
    } else {
      const orderId = randomUUID();
      order = new Order({
        orderId,
        bookingRef: hotelBookingExists?._id,
        bookingId: hotelBookingExists?.bookingId,
        orders: [newOrderItem],
      });
    }

    await order.save();

    return NextResponse.json(
      {
        message: "Item ordered successfully, and delivered to your room soon",
        success: true,
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error?.message);

    return NextResponse.json(
      { message: error?.message || "Internal server error", success: false },
      { status: error?.statusCode || 500 }
    );
  }
}
