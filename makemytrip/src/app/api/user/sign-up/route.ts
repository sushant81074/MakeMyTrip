import User from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { fieldValidator } from "@/helper/fieldValidator";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      return NextResponse.json({ message: "invalid method" }, { status: 405 });

    const { email, username, password, contactNo } = await request.json();

    const requestedFields = {
      email,
      username,
      password,
      contactNo,
    };
    const validFields = ["email", "username", "password", "contactNo"];

    const invalidFields = fieldValidator(validFields, requestedFields);

    if (
      invalidFields.invalidFields.length > 0 ||
      invalidFields.missingFields.length > 0
    )
      return NextResponse.json(
        {
          message: `${invalidFields.invalidFields}||${invalidFields.missingFields}`,
        },
        { status: 400 }
      );

    const userExists = await User.findOne({ $and: [{ email }, { username }] });

    if (userExists)
      return NextResponse.json(
        { message: `user already exists with this username and email` },
        { status: 400 }
      );

    let otp = otpGenerator();
    let userId = randomUUID();

    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      otp,
      userId,
      email,
      username,
      contactNo,
      password: hashedPassword,
    });

    if (!newUser)
      return NextResponse.json(
        { message: `user registeration unsuccessful` },
        { status: 400 }
      );

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: email,
      subject: "Account Verification OTP",
      text: `Name: ${username}\nEmail: ${email}\nMessage: Your OTP ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message:
          "user registration successful please verify user with verification mail sent to you",
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.status || 500 }
    );
  }
}
