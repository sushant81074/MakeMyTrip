import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

async function PATCH(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "PATCH")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const session = await getServerSession();

    if (!session || session?.user?._id)
      return NextResponse.json(
        { message: "unauthorized user" },
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
