import { checkValidHotel } from "@/helper/checkValidHotel";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import RoomType from "@/model/roomType.model";
import mongoose from "mongoose";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    const { valid, hotel } = await checkValidHotel(tokenData);

    if (!valid) throw new ApiError(401, "invalid user cerdentials");

    const roomTypeId = request.nextUrl.searchParams.get("roomTypeId");

    let obj = {};

    if (roomTypeId)
      obj = {
        hotelRef: new mongoose.Schema.ObjectId(hotel?._id),
        roomTypeId: roomTypeId,
      };
    else
      obj = {
        hotelRef: new mongoose.Schema.ObjectId(hotel?._id),
      };

    let emptyRooms = await RoomType.aggregate([
      {
        $match: {
          ...obj,
        },
      },
      {
        $lookup: {
          from: "Room",
          localField: "roomType",
          foreignField: "_id",
          as: "rooms",
        },
      },
      {
        $unwind: "$rooms",
      },
      {
        $project: {
          _id: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          roomType: 0,
          hotelRef: 0,
        },
      },
    ]);

    return NextResponse.json(
      {
        message: "empty room/s fetched successfully",
        success: true,
        rooms: emptyRooms,
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
