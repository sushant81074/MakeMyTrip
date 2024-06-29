import Hotel from "@/model/hotels.model";
import { fieldValidator } from "@/helper/fieldValidator";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "next/dist/server/api-utils";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const { name, hotelEmail, hotelPassword } = await request.json();

    const validFields = ["name", "hotelEmail", "hotelPassword"];
    const requestedFields = { name, hotelEmail, hotelPassword };

    const { invalidFields, missingFields } = fieldValidator(
      validFields,
      requestedFields
    );

    if (invalidFields.length || missingFields.length)
      return NextResponse.json(
        {
          message: `${invalidFields ? invalidFields : ""}${
            missingFields ? missingFields : ""
          }`,
        },
        { status: 400 }
      );

    const hotelExists = await Hotel.findOne({ name, hotelEmail });

    if (!hotelExists)
      return NextResponse.json(
        { message: `hotel with email:${hotelEmail} and name: ${name}` },
        { status: 400 }
      );

    const isPasswordCorrect = await bcrypt.compare(
      hotelPassword,
      hotelExists.hotelPassword
    );

    if (!isPasswordCorrect)
      return NextResponse.json(
        { message: `invalid password` },
        { status: 400 }
      );

    const tokenData = {
      _id: hotelExists?._id,
      hotelId: hotelExists.hotelId,
      hotelEmail: hotelExists.hotelEmail,
      name: hotelExists.name,
    };

    const hotelAccessToken = await jwt.sign(
      tokenData,
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );

    const response = NextResponse.json(
      { message: "hotel sign-in successful", success: true },
      { status: 200 }
    );

    response.cookies.set("token", hotelAccessToken, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    console.error("error occured during hotel creation", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.status || 500 }
    );
  }
}
