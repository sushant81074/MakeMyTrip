import { checkValidHotel } from "@/helper/checkValidHotel";
import { fieldValidator } from "@/helper/fieldValidator";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import HotelBooking from "@/model/hotelBooking.model";
import Room from "@/model/room.model";
import RoomType from "@/model/roomType.model";
import User from "@/model/user.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import { randomUUID } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type AssignGuest = {
  fromDate: Date;
  toDate: Date;
  roomTypeId: string;
  userId: string;
  roomNumber: number;
  roomId: string;
};

const validFields = [
  "fromDate",
  "toDate",
  "roomTypeId",
  "userId",
  "roomNumber",
  "roomId",
];

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "PATCH")
      throw new ApiError(405, "Invalid request method");

    const tokenData: any = await tokenDecrypter(request);
    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "Unauthorized user");

    const { valid, hotel }: any = checkValidHotel(tokenData);
    if (!valid) throw new ApiError(401, "Invalid hotel credentials");

    const requestData: AssignGuest = await request.json();
    if (!requestData) throw new ApiError(400, "No request body found");

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestData
    );
    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.join(", ")} ${missingFields.join(", ")}`
      );

    const user = await User.findOne({ _id: requestData.userId });
    if (!user) throw new ApiError(404, "User with provided userId not found");

    const roomType = await RoomType.findOne({ _id: requestData.roomTypeId });
    if (!roomType)
      throw new ApiError(404, "Room type with provided id not found");

    const room = await Room.findOne({
      _id: requestData.roomId,
      roomNumber: requestData.roomNumber,
    });
    if (!room)
      throw new ApiError(404, "Room with provided id & number not found");

    if (room.currentAvailabilityStatus === "NOT_AVAILABLE")
      throw new ApiError(
        400,
        "Room currentAvailabilityStatus is set as 'NOT_AVAILABLE'"
      );

    const fromDate = new Date(requestData.fromDate);
    const toDate = new Date(requestData.toDate);

    const isUnavailable = room.availabilitydates.unavailable.some(
      (unavailablePeriod: any) =>
        (new Date(unavailablePeriod.startDate) <= fromDate &&
          new Date(unavailablePeriod.endDate) >= fromDate) ||
        (new Date(unavailablePeriod.startDate) <= toDate &&
          new Date(unavailablePeriod.endDate) >= toDate)
    );

    if (isUnavailable)
      throw new ApiError(400, "Room is unavailable between the provided dates");

    const bookingId = randomUUID();

    room.currentlyAssignedGuest = user._id;
    room.assignedFromDate = fromDate;
    room.assignedToDate = toDate;
    room.availabilitydates.unavailable.push({
      startDate: fromDate,
      endDate: toDate,
    });

    await room.save();

    const booking = await HotelBooking.create({
      bookingId,
      roomNumber: room.roomNumber,
      roomId: room._id,
      roomTypeId: roomType._id,
      guestId: user._id,
      roomRef: room._id,
      roomTypeRef: roomType._id,
      hotelRef: hotel._id,
      userRef: user._id,
      fromDate,
      toDate,
    });

    if (!booking) throw new ApiError(500, "Unable to create booking");

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: user.email,
      subject: "Hotel Booking Successful",
      text: `Name: ${user.username}\nEmail: ${user.email}\nMessage: your room with room number: ${room.roomNumber} of roomType: ${roomType.name} has been booked in hotel with hotelId: ${roomType.hotelId} successfully.\n Your Booking Id: ${booking.bookingId}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Booking done successfully", success: true, booking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error.message);

    return NextResponse.json(
      {
        message: error.message || "Internal server error",
        success: false,
      },
      { status: error.statusCode || 500 }
    );
  }
}

// import { checkValidHotel } from "@/helper/checkValidHotel";
// import { fieldValidator } from "@/helper/fieldValidator";
// import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
// import dbConnect from "@/lib/dbConnect";
// import HotelBooking from "@/model/hotelBooking.model";
// import Room from "@/model/room.model";
// import RoomType from "@/model/roomType.model";
// import User from "@/model/user.model";
// import { MailOptions } from "@/utils/mailOptions";
// import transporter from "@/utils/nodemailer";
// import { randomUUID } from "crypto";
// import { ApiError } from "next/dist/server/api-utils";
// import { NextRequest, NextResponse } from "next/server";

// type AssignGuest = {
//   fromDate: Date;
//   toDate: Date;
//   roomTypeId: string;
//   userId: string;
//   roomNumber: number;
//   roomId: string;
// };

// const validFields = [
//   "fromDate",
//   "toDate",
//   "roomTypeId",
//   "userId",
//   "roomNumber",
//   "roomId",
// ];

// export async function PATCH(request: NextRequest) {
//   await dbConnect();

//   try {
//     if (request.method !== "PATCH")
//       throw new ApiError(405, "invalid request method");

//     const tokenData: any = await tokenDecrypter(request);

//     if (!tokenData || !tokenData?._id)
//       throw new ApiError(401, "unauthroized user");

//     const { valid, hotel }: any = checkValidHotel(tokenData);

//     if (!valid) throw new ApiError(401, "invalid hotel credentials");

//     const requestData: AssignGuest = await request.json();

//     if (!requestData) throw new ApiError(400, "no request body found");

//     const { invalidFields, missingFields } = fieldValidator(
//       validFields,
//       requestData
//     );

//     if (invalidFields.length || missingFields.length)
//       throw new ApiError(
//         400,
//         `${invalidFields ? invalidFields : ""} ${
//           missingFields ? missingFields : ""
//         }`
//       );

//     const user = await User.findOne({ userId: requestData.userId });
//     if (!user) throw new ApiError(404, "user with provided userid not found");

//     const roomType = await RoomType.findOne({
//       roomTypeId: requestData.roomTypeId,
//     });

//     if (!roomType)
//       throw new ApiError(404, "room type with provided id not found");

//     const room = await Room.findOne({
//       roomId: requestData.roomId,
//       roomNumber: requestData.roomNumber,
//     });

//     if (room)
//       throw new ApiError(404, "room with provided id & number not found");

//     if (room.currentAvailabilityStatus == "NOT_AVAILABLE")
//       throw new ApiError(
//         400,
//         "room currentAvailabilityStatus is set as 'NOT_AVAILABLE' "
//       );

//     if (
//       Date.parse(`${room.availabilitydates.unavailable.startDate}`) ==
//         Date.parse(`${requestData.fromDate}`) &&
//       Date.parse(`${room.availabilitydates.unavailable.endDate}`) ==
//         Date.parse(`${requestData.toDate}`)
//     )
//       throw new ApiError(
//         400,
//         "roomId and roomNumber you entered are unavailable between fromdate and todate interval"
//       );

//     const bookingId = randomUUID();

//     room.currentlyAssignedGuest = user?._id;
//     room.assignedFromDate = requestData.fromDate;
//     room.assignedToDate = requestData.toDate;
//     room.availabilitydates.unavailable.push({
//       startDate: requestData.fromDate,
//       endDate: requestData.toDate,
//     });

//     await room.save();

//     const booking = await HotelBooking.create({
//       bookingId,
//       roomNumber: room.roomNumber,
//       roomId: room.roomId,
//       roomTypeId: roomType.roomTypeId,
//       guestId: user.userId,
//       roomRef: room?._id,
//       roomTypeRef: roomType?._id,
//       hotelRef: hotel?._id,
//       userRef: user?._id,
//       fromDate: requestData.fromDate,
//       toDate: requestData.toDate,
//     });

//     if (!booking) throw new ApiError(500, "unable to create booking");

//     const mailOptions: MailOptions = {
//       from: process.env.EMAIL || "",
//       to: user?.email,
//       subject: "Hotel Booking Successfull",
//       text: `Name: ${user?.username}\nEmail: ${user?.email}\nMessage:your room with room number : ${room.roomNumber} of roomType : ${roomType?.name} has been booked in hotel with hotelId : ${roomType?.hotelId} successfully\n Your Booking Id : ${booking.bookingId}`,
//     };

//     await transporter.sendMail(mailOptions);

//     return NextResponse.json(
//       { message: "booking done successfully", success: true, booking },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("error occured :", error?.message);

//     return NextResponse.json(
//       {
//         message: error?.message || "internal server error",
//         success: false,
//       },
//       { status: error?.statusCode || 500 }
//     );
//   }
// }
