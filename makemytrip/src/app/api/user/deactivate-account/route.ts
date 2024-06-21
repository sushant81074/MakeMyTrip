import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "PATCH")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    let _id = 0;
    let session = await getServerSession({
      // @ts-ignore
      req: request,
      options: authOptions,
    });
    console.log(session);

    let token = await getToken({
      // @ts-ignore
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log("token", token);

    if ((!session || !session?.user?._id) && (!token || !token?._id))
      return NextResponse.json(
        { message: "unauthenticated user" },
        { status: 401 }
      );

    const deacitvateUser = await User.findByIdAndUpdate(
      session?.user?._id,
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
      { status: error.status || 500 }
    );
  }
}
