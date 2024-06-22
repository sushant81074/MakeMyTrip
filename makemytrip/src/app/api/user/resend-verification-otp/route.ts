import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  await dbConnect();
  try {
    if (request.method !== "PATCH")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const { email } = await request.json();

    if (!email || email == "")
      return NextResponse.json({ message: "email is empty" }, { status: 400 });

    const otp = otpGenerator();

    const user = await User.findOne({ email });

    if (user.isVerified)
      return NextResponse.json(
        { message: "user is already verified" },
        { status: 400 }
      );

    user.otp = otp;
    await user.save();

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: email,
      subject: "Account Verification OTP",
      text: `Email: ${email}\nMessage: Your Account Verification OTP is  ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Account Verification OTP sent on your email successfully",
        success: true,
      },
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
