import User from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { fieldValidator } from "@/utils/fieldValidator";
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
    console.log("Request body:", { email, username, password, contactNo });

    const requestedFields = {
      email,
      username,
      password,
      contactNo,
    };
    const validFields = ["email", "username", "password", "contactNo"];

    const invalidFields = fieldValidator(validFields, requestedFields);

    if (parseInt(invalidFields.length) > 0)
      return NextResponse.json(
        { message: `${invalidFields}` },
        { status: 400 }
      );

    const userExists = await User.findOne({ $and: [{ email }, { username }] });

    if (userExists)
      return NextResponse.json(
        { message: `user already exists with this username and email` },
        { status: 401 }
      );

    let otp = otpGenerator();
    let userId = randomUUID();

    const newUser = await User.create({ otp, userId, ...requestedFields });

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
  } catch (error) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: "error occured", success: false },
      { status: 500 }
    );
  }
}
