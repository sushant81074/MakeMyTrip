import { fieldValidator } from "@/helper/fieldValidator";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const { otp, email, username, newPassword } = await request.json();

    const validFields = ["otp", "email", "username", "newPassword"];
    const requestedFields = { otp, email, username, newPassword };

    const { missingFields } = fieldValidator(validFields, requestedFields);

    if (missingFields.length)
      throw new ApiError(400, `${missingFields} are required`);

    const userExists = await User.findOne({ email, username });

    if (!userExists)
      throw new ApiError(
        404,
        `${username} and ${email} having user not exists in the system`
      );

    if (requestedFields.otp !== userExists.otp) {
      await User.findByIdAndUpdate(
        userExists?._id,
        { $unset: { otp: 1 } },
        { new: true }
      );
      throw new ApiError(400, "invalid / wrong otp");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const pswdUpdtUsr = await User.findByIdAndUpdate(
      userExists?._id,
      {
        $set: {
          password: newHashedPassword,
        },
      },
      { new: true }
    );

    if (!pswdUpdtUsr) throw new ApiError(500, "new password set unsuccessful");

    return NextResponse.json(
      {
        message: `new password set with ${pswdUpdtUsr.username}&${pswdUpdtUsr.email}`,
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
