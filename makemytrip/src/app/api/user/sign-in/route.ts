import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { fieldValidator } from "@/helper/fieldValidator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    if (request.method !== "POST")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const { email, password } = await request.json();

    const validFields = ["email", "password"];
    const requestedFields = { email, password };

    const invalidFields = fieldValidator(validFields, requestedFields);

    if (
      invalidFields.invalidFields.length > 0 ||
      invalidFields.missingFields.length > 0
    )
      return NextResponse.json(
        { message: `${invalidFields}` },
        { status: 400 }
      );

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json(
        { message: "user with email doesn't exists" },
        { status: 400 }
      );

    if (!user.isVerified)
      return NextResponse.json(
        {
          message: "user with email isn't verified, please verify your account",
        },
        { status: 400 }
      );

    if (!user.isActive)
      return NextResponse.json(
        {
          message:
            "user with email is inActive, please reactivate your account",
        },
        { status: 400 }
      );

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return NextResponse.json(
        { message: "incorrect password" },
        { status: 400 }
      );

    const tokenData = {
      _id: user._id,
      userId: user.userId,
      email: user.email,
      username: user.username,
    };

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        message: "login successful",
        success: true,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.status || 500 }
    );
  }
}
