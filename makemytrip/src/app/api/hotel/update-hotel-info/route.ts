import { checkValidHotel } from "@/helper/checkValidHotel";
import { fieldValidator } from "@/helper/fieldValidator";
import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import Hotel from "@/model/hotels.model";
import { MailOptions } from "@/utils/mailOptions";
import transporter from "@/utils/nodemailer";
import otpGenerator from "@/utils/otpGenerator";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

type HotelUpdateData = {
  name: string;
  hotelId: string;
  hotelEmail: string;
  city: string;
  state: string;
  address: string;
  postalCode: number;
  landmark: string;
  terrain: string;
  hotelPhoto: string;
  totalRooms: number;
  hotelRating: number;
  checkInTime: string;
  checkOutTime: string;
  staffNo: number;
};

const validFields = [
  "name",
  "hotelId",
  "hotelEmail",
  "city",
  "state",
  "address",
  "postalCode",
  "landmark",
  "terrain",
  "hotelPhoto",
  "totalRooms",
  "hotelRating",
  "checkInTime",
  "checkOutTime",
  "staffNo",
];

export async function PATCH(request: NextRequest) {
  try {
    if (request.method !== "PATCH")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    const { valid, hotel }: any = await checkValidHotel(tokenData);

    if (!valid) throw new ApiError(401, "invalid hotel credentials");

    const requestedFields: HotelUpdateData = await request.json();

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      throw new ApiError(
        400,
        `${invalidFields.length ? invalidFields : ""} ${
          missingFields.length ? missingFields : ""
        }`
      );

    const otp = otpGenerator();

    const updatedHotel = await Hotel.findByIdAndUpdate(
      hotel?._id,
      {
        $set: {
          otp,
          isVerified: false,
          isActive: false,
          ...requestedFields,
        },
      },
      { new: true }
    ).select("-_id -hotelPassword -owner -manager -__v ");

    if (!updatedHotel) throw new ApiError(404, "hotel not found to be updated");

    const mailOptions: MailOptions = {
      from: process.env.EMAIL || "",
      to: hotel?.email,
      subject: "Hotel Updates Verification Otp",
      text: `Message: Your updation verification otp is : ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "hotel updated successfully", updatedHotel, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error?.message);

    return NextResponse.json(
      {
        message: error?.message || "internal server error",
        success: false,
      },
      {
        status: error?.statusCode || 500,
      }
    );
  }
}
