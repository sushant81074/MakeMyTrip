import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getToken } from "next-auth/jwt";

export async function GET(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "GET")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    let session = await getServerSession(authOptions);

    let token = await getToken({
      //@ts-ignore
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if ((!session || !session?.user?._id) && (!token || !token?._id))
      return NextResponse.json(
        { message: "unauthenticated user" },
        { status: 401 }
      );

    const currentUser = await User.findById(
      session?.user?._id || token?._id
    ).select("-password -_id -__v -updatedAt");

    if (!currentUser)
      return NextResponse.json(
        { message: "user not found", success: false, currentUser },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "user fetched successfully", success: true, currentUser },
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
