import Hotel from "@/model/hotels.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    const params = request.nextUrl.searchParams;

    const allHotels = await Hotel.find({
      ...params,
      hotelRating: { $in: [3, 5] },
    }).limit(25);

    return NextResponse.json(
      { message: "all hotels fetched successfully", allHotels, success: true },
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
