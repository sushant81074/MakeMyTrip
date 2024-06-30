import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import Room from "@/model/room.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type AssignGuest = {};

const validFields = ["fromDate", "toDate", "roomNumber"];

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "PATCH")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthroized user");

    const requestData = await request.json();
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
