import dbConnect from "@/lib/dbConnect";
import Hotel from "@/model/hotels.model";
import { fieldValidator } from "@/utils/fieldValidator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const { email, otp } = await request.json();

    const requestedFields = { email, otp };
    const validFields = ["email", "otp"];

    const invalidFields = fieldValidator(validFields, requestedFields);
    if (invalidFields.length)
      return NextResponse.json(
        { message: `${invalidFields}` },
        { status: 400 }
      );

    console.log(email);
    const hotel = await Hotel.findOne({ hotelEmail: email });
    if (!hotel)
      return NextResponse.json({ message: "hotel not found" }, { status: 404 });

    if (hotel.isVerified)
      return NextResponse.json(
        { message: "hotel already verified" },
        { status: 400 }
      );

    if (hotel.otp !== otp)
      return NextResponse.json(
        { message: "invalid otp", success: false },
        { status: 400 }
      );

    const verifiedHotel = await Hotel.findOneAndUpdate(
      hotel._id,
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

    if (!verifiedHotel?.isVerified)
      return NextResponse.json(
        { message: "hotel verification unsuccessful", success: false },
        { status: 500 }
      );

    return NextResponse.json(
      {
        message: "hotel verification successful",
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
