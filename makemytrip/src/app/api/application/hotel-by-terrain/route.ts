import { checkValidUser } from "@/helper/checkValidUser";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import Hotel from "@/model/hotels.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    if (!(await checkValidUser(tokenData)))
      throw new ApiError(401, "invalid user credentials");

    const terrain = request.nextUrl.searchParams.get("terrain");
    // @ts-ignore
    console.log(terrain);

    const hotelByTerrain = await Hotel.find({
      terrain,
      isActive: true,
      isVerified: true,
    }).select(
      "-_id -password -owner -manager -staffNo -isVerified -isActive -__v -createdAt -updatedAt"
    );

    return NextResponse.json(
      {
        message: "hotels by terrain fetched successfully",
        hotelsCount: hotelByTerrain.length,
        hotelByTerrain,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.statusCode || 500 }
    );
  }
}
