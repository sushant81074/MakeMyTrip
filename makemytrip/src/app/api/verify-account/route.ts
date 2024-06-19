import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { fieldValidator } from "@/utils/fieldValidator";
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

    if (verifyAccount.otp == otp) {
      verifyAccount.isActive = true;
      verifyAccount.isVerified = true;
    }

    await verifyAccount.save();

    return NextResponse.json(
      {
        message: "account verification successful",
        success: true,
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
