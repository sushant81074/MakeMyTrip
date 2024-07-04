import { checkValidHotel } from "@/helper/checkValidHotel";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import RequestBooking from "@/model/requestBooking.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const reqBookingId = request.nextUrl.searchParams.get("reqBookingId");

    const { valid, hotel } = await checkValidHotel(tokenData);

    console.log(valid, hotel);
    if (!valid) throw new ApiError(401, "invalid user credentials");

    if (reqBookingId) {
      const singleRequest = await RequestBooking.findOne({
        reqBookingId,
      }).select("-_id -__v -createdAt -updatedAt");

      return NextResponse.json(
        {
          message: "selected request fetched successfully",
          success: true,
          singleRequest,
        },
        { status: 200 }
      );
    }

    const allRequests = await RequestBooking.find({
      hotelId: hotel?.hotelId,
    }).select("-_id -__v -createdAt -updatedAt");

    return NextResponse.json(
      {
        message: "all requests for bookings fetched successfully",
        requests: allRequests,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error?.message);

    return NextResponse.json(
      { message: error?.message || "internal sever error", success: false },
      { status: error?.statusCode || 500 }
    );
  }
}
