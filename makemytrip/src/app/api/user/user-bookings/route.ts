// @ts-nocheck

import { checkValidUser } from "@/helper/checkValidUser";
import { fieldValidator } from "@/helper/fieldValidator";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import HotelBooking from "@/model/hotelBooking.model";
import Room from "@/model/room.model";
import RoomType from "@/model/roomType.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import { randomUUID } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type BookingData = {
  roomTypeId: string;
  hotelId: string;
  fromDate: Date;
  toDate: Date;
};

const validFields = ["hotelId", "roomTypeId", "fromDate", "toDate"];

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      return NextResponse.json({ message: "invalid method" }, { status: 405 });

    let tokenData = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    let { valid, user }: any = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "invalid user credentials");

    const bookingData: BookingData = await request.json();

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      bookingData
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields ? invalidFields : ""} 
        ${missingFields ? missingFields : ""}`
      );

    if (
      booking.fromDate.getTime() >
      new Date().getTime() + 15 * 24 * 60 * 60 * 1000
    ) {
      throw new ApiError(
        400,
        "We don't book for more than 15 days in advance."
      );
    }

    const roomTypeWithHotelExists = await RoomType.findOne({
      roomTypeId: bookingData?.roomTypeId,
      hotelId: bookingData?.hotelId,
    });

    if (!roomTypeWithHotelExists)
      throw new ApiError(404, "hotel with room type not found");

    const roomsAvailable = await Room.find({
      roomType: roomTypeWithHotelExists?._id,
      hotelRef: roomTypeWithHotelExists?.hotelRef,
    });

    let roomAssigned = {};
    for (let i = 0; i < roomsAvailable.length; i++) {
      // Check for overlapping unavailable periods with any user (not just same user)
      const unavailableClash = roomsAvailable[
        i
      ].availabilitydates.unavailable.some(
        (unavailableDate) =>
          unavailableDate.startDate <= bookingData.fromDate &&
          unavailableDate.endDate >= bookingData.toDate
      );

      if (
        // Check for available dates or completely empty availabilitydates
        (roomsAvailable[i].availabilitydates.available.some(
          (availableDate) =>
            availableDate.startDate <= bookingData.fromDate &&
            availableDate.endDate >= bookingData.toDate
        ) ||
          (roomsAvailable[i].availabilitydates.available.length === 0 &&
            roomsAvailable[i].availabilitydates.unavailable.length === 0)) &&
        !unavailableClash
      ) {
        // Room either available, completely empty, or no clash with existing unavailabilities
        roomsAvailable[i].availabilitydates.unavailable.push({
          startDate: bookingData.fromDate,
          endDate: bookingData.toDate,
          guest: tokenData?._id,
        });
        roomAssigned = roomsAvailable[i];
        await roomAssigned.save();
        console.log("assigned room------------ ", roomAssigned);
        break;
      }
    }

    if (!roomAssigned || !roomAssigned?.bookingId)
      throw new ApiError(200, "No room available for this booking period");

    console.log("roomAssigned----------", roomAssigned);

    let bookingId = randomUUID();
    const booking = await HotelBooking.create({
      bookingId,
      roomNumber: roomAssigned.roomNumber,
      roomId: roomAssigned?.roomId,
      roomTypeId: bookingData?.roomTypeId,
      hotelId: bookingData?.hotelId,
      guestId: user?.userId,
      roomRef: roomAssigned?._id,
      roomTypeRef: roomAssigned?.roomType,
      hotelRef: roomAssigned?.hotelRef,
      userRef: user?._id,
      fromDate: bookingData?.fromDate,
      toDate: bookingData?.toDate,
    });

    if (!booking) throw new ApiError(500, "booking unsuccessful");

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: user?.email,
      subject: "Hotel Booking Successfull",
      text: `Name: ${user?.username}\nEmail: ${user?.email}\nMessage:your room with room number : ${roomAssigned.roomNumber} of roomType : ${roomTypeWithHotelExists?.name} has been booked in hotel with hotelId : ${roomTypeWithHotelExists?.hotelId} successfully\n Your Booking Id : ${booking.bookingId}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "hotel room booked successfully",
        success: true,
      },
      { status: 201 }
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

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const { valid, user } = await checkValidUser(tokenData);

    if (!valid) throw new ApiError(401, "invalid user credentials");

    const allUserBookings = await HotelBooking.find({ userRef: user?._id });

    if (!allUserBookings.length)
      throw new ApiError(200, "look's like you have no bookings");

    return NextResponse.json(
      {
        message: "all user bookings fetched successfully",
        allUserBookings,
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
