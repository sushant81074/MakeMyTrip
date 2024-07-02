import { checkValidUser } from "@/helper/checkValidUser";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import HotelBooking from "@/model/hotelBooking.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    let bookingId = await request.nextUrl.searchParams.get("bookingId");

    if (!bookingId) throw new ApiError(400, "no hotel selected");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const { valid, user }: any = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "invalid user credentials");

    const booking = await HotelBooking.findOne({ bookingId });

    return NextResponse.json(
      {
        message: booking
          ? ` user booking with bookingId : ${bookingId} fetched successfully`
          : `looks like you have no booking with bookingId : ${bookingId} in this hotel`,
        bookings: booking,
        success: true,
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
