import Hotel from "@/model/hotels.model";
import { fieldValidator } from "@/utils/fieldValidator";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      return NextResponse.json(
        { message: "invalid request method", success: false },
        { status: 405 }
      );

    const { name, hotelEmail, password } = await request.json();

    const validFields = ["name", "hotelEmail", "password"];
    const requestedFields = { name, hotelEmail, password };

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
      password,
      hotelExists.password
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

    response.cookies.set("hotelAccessToken", hotelAccessToken, {
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
