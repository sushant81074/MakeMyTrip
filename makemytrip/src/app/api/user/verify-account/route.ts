import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { fieldValidator } from "@/helper/fieldValidator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, otp } = await request.json();

    const requestedFields = { email, otp };
    const validFields = ["email", "otp"];

    const invalidFields = fieldValidator(validFields, requestedFields);

    if (
      invalidFields.invalidFields.length > 0 ||
      invalidFields.missingFields.length > 0
    )
      return NextResponse.json(
        { message: `${invalidFields}` },
        { status: 400 }
      );

    let verifyAccount = await User.findOne({ email });
    if (!verifyAccount)
      return NextResponse.json({ message: "user not found" }, { status: 404 });

    if (verifyAccount?.isVerified)
      return NextResponse.json(
        { message: "account already verified" },
        { status: 400 }
      );

    if (verifyAccount.otp != otp)
      return NextResponse.json(
        { message: "invalid otp, email verification unsuccessful" },
        { status: 400 }
      );

    const verifiedAccount = await User.findByIdAndUpdate(
      verifyAccount._id,
      {
        $set: {
          isVerified: true,
          isActive: true,
        },
        $unset: {
          otp: 1,
        },
      },
      { new: true }
    );

    if (!verifiedAccount?.isVerified)
      return NextResponse.json(
        {
          message:
            "email verification unsuccessful, 'cause user with email not found",
        },
        { status: 404 }
      );

    return NextResponse.json(
      {
        message: "account verification successful",
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
      { status: error.status || 500 }
    );
  }
}
