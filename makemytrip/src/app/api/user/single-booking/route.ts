import { checkValidUser } from "@/helper/checkValidUser";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import HotelBooking from "@/model/hotelBooking.model";
import Room from "@/model/room.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import mongoose from "mongoose";
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

export async function PATCH(request: NextRequest) {
  try {
    if (request.method !== "PATCH") {
      throw new ApiError(405, "Invalid request method");
    }

    const bookingId = request.nextUrl.searchParams.get("bookingId");
    if (!bookingId) {
      throw new ApiError(400, "No bookingId selected");
    }

    const tokenData: any = tokenDecrypter(request);
    if (!tokenData || !tokenData._id) {
      throw new ApiError(401, "Unauthorized user");
    }

    const { valid, user }: any = await checkValidUser(tokenData);
    if (!valid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const booking = await HotelBooking.findOneAndUpdate(
      { bookingId },
      { $set: { isCancelled: true } },
      { new: true }
    );
    if (!booking) {
      throw new ApiError(404, "Booking not found with selected booking id");
    }

    const room = await Room.findById(booking.roomRef);
    if (!room) {
      throw new ApiError(404, "Room not found for the booking");
    }

    const { availabilitydates } = room;
    const { unavailable } = availabilitydates;

    const index = unavailable.findIndex(
      (date: any) =>
        date.guest === booking.userRef &&
        new Date(date.startDate).getTime() ===
          new Date(booking.fromDate).getTime() &&
        new Date(date.endDate).getTime() === new Date(booking.toDate).getTime()
    );

    if (index > -1) {
      unavailable.splice(index, 1);
      await room.save();
    }

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: user?.email,
      subject: "Hotel Booking Cancellation Successful",
      text: `Message:your room with room number : ${room.roomNumber} booking has been cancelled in hotel with hotelId : ${booking?.hotelId} successfully\n Your Cancelled Booking Id : ${booking.bookingId}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Booking cancelled successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error.message);

    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: error.statusCode || 500 }
    );
  }
}

// my implementation
// export async function PATCH(request: NextRequest) {
//   try {
//     if (request.method !== "PATCH")
//       throw new ApiError(405, "invalid request method");
//     const bookingId = request.nextUrl.searchParams.get("bookingId");
//     if (!bookingId) throw new ApiError(400, "no bookingId selected");
//     const tokenData: any = tokenDecrypter(request);
//     if (!tokenData || !tokenData?._id)
//       throw new ApiError(401, "unauthorized user");
//     const { valid, user }: any = await checkValidUser(tokenData);
//     if (!valid) throw new ApiError(401, "invalid user credentials");
//     const booking = await HotelBooking.findOneAndUpdate(
//       { bookingId },
//       {
//         $set: {
//           isCancelled: true,
//         },
//       },
//       { new: true }
//     );
//     if (!booking)
//       throw new ApiError(404, "booking not found with selected booking id");
//     const removeRoomUnavailability = await Room.findById(booking?.roomRef);
//     for (let unavailable of removeRoomUnavailability.availabilitydates
//       .unavailable) {
//       if (
//         unavailable.guest == booking?.userRef &&
//         Date.parse(`${unavailable.startDate}`) ==
//           Date.parse(booking?.fromDate) &&
//         Date.parse(`${unavailable.endDate}`) == Date.parse(booking?.toDate)
//       ) {
//         removeRoomUnavailability.availabilitydates.unavailable.pop(
//           removeRoomUnavailability.availabilitydates.unavailable.indexOf(
//             unavailable
//           )
//         );
//         await removeRoomUnavailability.availabilitydates.unavailable.save();
//       }
//     }
//     return NextResponse.json(
//       { message: "booking cancelled successfully", success: true },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error("error occured :", error?.message);
//     return NextResponse.json(
//       { message: "internal server error", success: false },
//       { status: error?.statusCode || 500 }
//     );
//   }
// }
