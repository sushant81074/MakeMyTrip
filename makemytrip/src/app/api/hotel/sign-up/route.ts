import dbConnect from "@/lib/dbConnect";
import Hotel from "@/model/hotels.model";
import bcrypt from "bcryptjs";
import { fieldValidator } from "@/helper/fieldValidator";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";

type HotelData = {
  name: string;
  hotelEmail: string;
  hotelPassword: string;
  owner: string;
  manager: string;
  city: string;
  state: string;
  address: string;
  postalCode: number;
  landmark: string;
  terrain: string;
  hotelPhoto: string;
  totalRooms: number;
  hotelRating: number;
  contactNo: number;
  checkInTime: string;
  checkOutTime: string;
  staffNo: number;
};

const validFields = [
  "name",
  "hotelEmail",
  "hotelPassword",
  "owner",
  "manager",
  "city",
  "state",
  "address",
  "postalCode",
  "landmark",
  "terrain",
  "hotelPhoto",
  "totalRooms",
  "hotelRating",
  "contactNo",
  "checkInTime",
  "checkOutTime",
  "staffNo",
];

export async function POST(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const hotelData: HotelData = await request.json();

    const invalidFields = fieldValidator(validFields, hotelData);

    if (
      invalidFields.invalidFields.length > 0 ||
      invalidFields.missingFields.length > 0
    )
      return NextResponse.json(
        { message: `${invalidFields}` },
        { status: 400 }
      );

    const hotelExists = await Hotel.findOne({
      name: hotelData.name,
      hotelEmail: hotelData.hotelEmail,
    });
    if (hotelExists)
      return NextResponse.json(
        { message: "hotel with hotelname and email already exists" },
        { status: 400 }
      );

    let otp = otpGenerator();
    let hotelId = randomUUID();
    let hashedPassword = await bcrypt.hash(hotelData.hotelPassword, 10);

    hotelData.hotelPassword = hashedPassword;

    const hotel = await Hotel.create({ ...hotelData, hotelId, otp });
    if (!hotel)
      return NextResponse.json(
        { message: "hotel creation unsuccessful" },
        { status: 400 }
      );

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: hotelData.hotelEmail,
      subject: "Hotel Verification OTP",
      text: `Name: ${hotelData.name}\nEmail: ${hotelData.hotelEmail}\nMessage: Your OTP ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "hotel creation successful,verify hotel with email" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("error occured during hotel creation", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.statusCode || 500 }
    );
  }
}
