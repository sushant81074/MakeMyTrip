import User from "@/model/user.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const { email, username } = await request.json();

    if (!username || username === "" || !email || email === "")
      throw new ApiError(400, "email is empty or not sent ");

    const userExists = await User.findOne({ email, username });

    if (!userExists)
      throw new ApiError(
        404,
        `user with ${username} & ${email} not exists in the system`
      );

    const otp = otpGenerator();

    userExists.otp = otp;
    await userExists.save();

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: email,
      subject: "Forgotten Password OTP",
      text: `Name: ${username}\nEmail: ${email}\nMessage: Your Forgotten Password OTP ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "forgotten password otp sent on your email",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      {
        message: error.message || "error verifing user account",
        success: false,
      },
      { status: error.statusCode || 500 }
    );
  }
}
