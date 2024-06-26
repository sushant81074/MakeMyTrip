import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "PATCH")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const tokenData: any = tokenDecrypter(request);
    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");

    const deacitvateUser = await User.findByIdAndUpdate(
      tokenData._id,
      {
        $set: {
          isActive: false,
        },
      },
      { new: true }
    );

    if (!deacitvateUser.isActive)
      return NextResponse.json(
        { message: "user not found to deactivate", success: false },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "user deactivation successful", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.statusCodeCode || 500 }
    );
  }
}
