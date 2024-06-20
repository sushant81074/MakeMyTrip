import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
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

    console.log(session);
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.status || 500 }
    );
  }
}
