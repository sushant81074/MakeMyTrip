import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { fieldValidator } from "@/utils/fieldValidator";
import console from "console";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, otp } = await request.json();

    const requestedFields = { email, otp };
    const validFields = ["email", "otp"];

    const invalidFields = fieldValidator(validFields, requestedFields);


    if (parseInt(invalidFields.length) > 0)
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
        { message: "email verification unsuccessful" },
        { status: 500 }
      );

    return NextResponse.json(
      {
        message: "account verification successful",
        success: true,
        verifiedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: "error verifing user account", success: false },
      { status: 500 }
    );
  }
}
