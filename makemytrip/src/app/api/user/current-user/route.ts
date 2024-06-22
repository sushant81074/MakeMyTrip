import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "GET")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const tokenData: any = await tokenDecrypter(request);
    console.log("tokenData", tokenData);

    const user = await User.findById(tokenData?._id).select(
      "-__v -password -_id -updatedAt"
    );
    console.log("user", user);

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
      { status: error.status || 500 }
    );
  }
}
