import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "GET")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const user = await User.findById(tokenData?._id).select(
      "-__v -password -_id -updatedAt"
    );

    if (!user)
      return NextResponse.json(
        { message: "current user not found", success: false },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "user fetched successfully", success: true, user },
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
