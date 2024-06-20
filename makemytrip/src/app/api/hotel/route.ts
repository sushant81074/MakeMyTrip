import dbConnect from "@/lib/dbConnect";
import Hotel from "@/model/hotels.model";
import { fieldValidator } from "@/utils/fieldValidator";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

type HotelData = {
  name: string;
  hotelEmail: string;
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
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const hotelData: HotelData = await request.json();

    const invalidFields = fieldValidator(validFields, hotelData);

    if (invalidFields.length)
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
      { status: error.status || 500 }
    );
  }
}
