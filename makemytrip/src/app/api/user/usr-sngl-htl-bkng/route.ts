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

    let hotelId = await request.nextUrl.searchParams.get("hotelId");

    if (!hotelId) throw new ApiError(400, "no hotel selected");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const { valid, user }: any = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "invalid user credentials");

    const allUserBookings = await HotelBooking.find({
      userRef: user?._id,
      hotelId,
    });

    return NextResponse.json(
      {
        message: allUserBookings.length
          ? "all user bookings fetched successfully"
          : "looks like you have no bookings in this hotel",
        bookings: allUserBookings,
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
