import { fieldValidator } from "@/helper/fieldValidator";
import Hotel from "@/model/hotels.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function POST(request: NextResponse) {
  try {
    // @ts-ignore
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const { name, hotelEmail } = await request.json();

    const validFields = ["hotelEmail", "name"];
    const requestedFields = { hotelEmail, name };

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields ? invalidFields : ""} ${
          missingFields ? missingFields : ""
        }`
      );

    const hotelExists = await Hotel.findOne({ hotelEmail, name });

    if (!hotelExists) throw new ApiError(404, "hotel not found");

    let otp = otpGenerator();

    hotelExists.otp = otp;
    await hotelExists.save();

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: hotelEmail,
      subject: "Forgotten Password OTP",
      text: `Name: ${name}\nEmail: ${hotelEmail}\nMessage: Your Forgotten Password OTP ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Forgotten Password OTP sent successfully", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error?.message);

    return NextResponse.json(
      { message: error?.message || "", success: false },
      { status: error?.statusCode || 500 }
    );
  }
}
