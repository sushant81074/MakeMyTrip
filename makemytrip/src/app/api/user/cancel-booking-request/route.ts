import { checkValidUser } from "@/helper/checkValidUser";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import RequestBooking from "@/model/requestBooking.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    if (request.method !== "PATCH")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    const { valid, user }: any = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "invalid user credentials");

    const reqBookingId = request.nextUrl.searchParams.get("reqBookingId");

    if (!reqBookingId)
      throw new ApiError(400, "no request booking id selected");

    const reqBook = await RequestBooking.findOneAndUpdate(
      { reqBookingId },
      {
        $set: {
          isCancelledByUser: true,
        },
      },
      { new: true }
    );

    if (!reqBook)
      throw new ApiError(
        404,
        "no request booking found to cancel from sent id"
      );

    return NextResponse.json(
      {
        message: "booking request cancelled successfully",
        success: true,
        requestBooking: reqBookingId,
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
