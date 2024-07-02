import { checkValidUser } from "@/helper/checkValidUser";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import mongoose from "mongoose";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      throw new ApiError(405, "Invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const { valid, user }: any = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "Invalid user credentials");

    const { bookingId } = await request.json();

    if (!bookingId || bookingId == "")
      throw new ApiError(400, "booking id is needed");

    const orders = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Schema.ObjectId(`${user?._id}`),
        },
      },
      {
        $lookup: {
          from: "HotelBooking",
          localField: `_id`,
          foreignField: `userRef`,
          as: "bookingData",
        },
      },
      {
        $unwind: {
          path: "$bookingData",
        },
      },
      {
        $match: {
          "bookingData.bookingId": bookingId,
        },
      },
      {
        $lookup: {
          from: "Order",
          localField: "bookingData._id",
          foreignField: "bookingRef",
          as: "orders",
        },
      },
    ]);

    if (!orders.length)
      throw new ApiError(200, "looks like you've ordered nothing yet");

    return NextResponse.json(
      {
        message: "user's all orders fetched successfully",
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error?.message);

    return NextResponse.json(
      {
        message: error?.message || "internal server error",
        success: false,
      },
      { status: error?.statusCode || 500 }
    );
  }
}
