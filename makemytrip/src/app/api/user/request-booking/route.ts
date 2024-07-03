import { fieldValidator } from "@/helper/fieldValidator";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import RequestBooking from "@/model/requestBooking.model";
import Room from "@/model/room.model";
import RoomType from "@/model/roomType.model";
import User from "@/model/user.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import { randomUUID } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type RequestBookingData = {
  hotelEmail: string;
  hotelId: string;
  roomTypeId: string;
  formDate: Date;
  toDate: Date;
};

const validFields = [
  "hotelEmail",
  "hotelId",
  "roomTypeId",
  "fromDate",
  "toDate",
];

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorised user");

    const requestBookingData: RequestBookingData = await request.json();

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestBookingData
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields ? invalidFields : ""}${
          missingFields ? missingFields : ""
        }`
      );

    const roomTypeWithHotelExists = await RoomType.findOne({
      hotelId: requestBookingData.hotelId,
      roomTypeId: requestBookingData.roomTypeId,
    });

    if (!roomTypeWithHotelExists)
      throw new ApiError(404, "roomType id With Hotel id doesn't Exists");

    let reqBookingId = randomUUID();
    const recordBokgReq = await RequestBooking.create({
      reqBookingId,
      userRef: tokenData?._id,
      roomTypeRef: roomTypeWithHotelExists?._id,
      hotelRef: roomTypeWithHotelExists?.hotelRef,
      ...requestBookingData,
    });

    if (!recordBokgReq)
      throw new ApiError(500, "unable to make booking request to the hotel");

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: tokenData?.email,
      subject: "Request Room Booking in Your Hotel",
      text: `Name: ${tokenData?.username}\nEmail: ${tokenData?.email}\nMessage: I would like to book a room of type : ${roomTypeWithHotelExists?.roomTypeId} in your hotel with hotelId : ${roomTypeWithHotelExists?.hotelId}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message:
          "request for room booking has been sent to hotel and recorded as well successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("error occured ", error?.message);

    return NextResponse.json(
      { message: error?.message || "internal server error", success: false },
      { status: error?.statusCode || 500 }
    );
  }
}
