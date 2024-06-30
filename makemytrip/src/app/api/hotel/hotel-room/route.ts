import { fieldValidator } from "@/helper/fieldValidator";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import Hotel from "@/model/hotels.model";
import Room from "@/model/room.model";
import RoomType from "@/model/roomType.model";
import { randomUUID } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type CreateRoomData = {
  roomTypeName: string;
  from: number;
  to: number;
  currentAvailabilityStatus: string;
};

const validFields = ["roomTypeName", "from", "to"];

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthroized user");

    const roomData: CreateRoomData = await request.json();

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      roomData
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields ? invalidFields : ""} ${
          missingFields ? missingFields : ""
        }`
      );

    const hotelExists = await Hotel.findById(tokenData?._id);

    if (!hotelExists)
      throw new ApiError(404, "hotel not found that you're assigning rooms to");

    if (!hotelExists.isActive || !hotelExists.isVerified)
      throw new ApiError(
        403,
        `forbidden access to hotel resources as hotel isVerified:${hotelExists.isVerified} and isAcitve:${hotelExists.isAcitve}`
      );

    const roomTypeExists = await RoomType.findOne({
      name: roomData.roomTypeName,
      hotelRef: hotelExists?._id,
    });

    if (!roomTypeExists)
      throw new ApiError(
        404,
        "room type of hotel not found that you're assigning to"
      );

    let roomsExists = await Room.find({
      hotelRef: hotelExists?._id,
      roomNumber: { $in: [roomData.from, roomData.to] },
    });

    if (roomsExists.length)
      throw new ApiError(409, `${roomsExists} allready exists in the system`);

    let newRooms = [];
    let count = 0;
    for (let i = roomData.from; i <= roomData.to; i++) {
      let roomId = randomUUID();
      newRooms.push(
        await Room.create({
          roomNumber: i,
          roomId,
          roomType: roomTypeExists?._id,
          hotelRef: hotelExists?._id,
          ...roomData,
        })
      );
      count++;
    }

    if (newRooms.length !== count)
      throw new ApiError(
        500,
        `not all rooms created, the created ones are :${newRooms}`
      );

    return NextResponse.json(
      { message: "rooms creation successful", newRooms, success: true },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("error occured :", error?.message);

    return NextResponse.json(
      { message: error?.message || "internal server error", success: false },
      { status: error?.statusCode || 500 }
    );
  }
}
