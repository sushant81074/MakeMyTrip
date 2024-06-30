import { fieldValidator } from "@/helper/fieldValidator";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import Hotel from "@/model/hotels.model";
import RoomType from "@/model/roomType.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import { randomUUID } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type RoomTypeData = {
  name: string;
  // fromRoomNumber: number;
  // toRoomNumber: number;
  averageRating: number;
  suite: string;
  maximumOccupancy: number;
  bedSize: string;
  roomArea: number;
  smokingAllowed: boolean;
  hasGallery: boolean;
  description: string;
  amenities: string[];
  img: string[];
  pricing: object;
  minStayInNights: number;
  maxStayInNights: number;
};

const validFields = [
  "name",
  // "fromRoomNumber",
  // "toRoomNumber",
  "averageRating",
  "suite",
  "maximumOccupancy",
  "bedSize",
  "roomArea",
  "smokingAllowed",
  "hasGallery",
  "description",
  "amenities",
  "img",
  "pricing",
  "minStayInNights",
  "maxStayInNights",
];

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      throw new ApiError(405, "Invalid request method");

    const tokenData: any = await tokenDecrypter(request);
    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "Unauthorized user");

    if (tokenData.role !== "HOTEL-ADMIN")
      throw new ApiError(403, "forbidden to make this request");

    const roomTypeData: RoomTypeData = await request.json();

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      roomTypeData
    );
    if (invalidFields.length || missingFields.length) {
      throw new ApiError(
        400,
        `Invalid Fields: ${invalidFields.join(
          ", "
        )}. Missing Fields: ${missingFields.join(", ")}.`
      );
    }

    const hotelExists = await Hotel.findOne({ hotelId: tokenData?.hotelId });
    if (!hotelExists)
      throw new ApiError(404, "Hotel not found for room type to be assigned");

    const roomTypeExists = await RoomType.findOne({ name: roomTypeData.name });
    if (roomTypeExists)
      throw new ApiError(409, "Room type already exists, you may update it");

    const roomTypeId = randomUUID();
    const roomType = await RoomType.create({
      roomTypeId,
      hotelRef: hotelExists?._id,
      ...roomTypeData,
    });

    if (!roomType) throw new ApiError(500, "Room type creation unsuccessful");

    const roomTypeCreated = await RoomType.findById(roomType?._id).select(
      "-_id -password -__v -createdAt -updatedAt"
    );

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: hotelExists.hotelEmail,
      subject: "Room Type Created and Assigned to Hotel Successfully",
      text: `Name: ${hotelExists.name}\nEmail: ${hotelExists.hotelEmail}\nMessage: Room type with name: ${roomType.name} has been assigned to hotel: ${hotelExists.name} successfully`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Room type created successfully",
        success: true,
        room: roomTypeCreated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error occurred:", error.message);

    return NextResponse.json(
      { message: error.message || "Internal server error", success: false },
      { status: error.statusCode || 500 }
    );
  }
}
