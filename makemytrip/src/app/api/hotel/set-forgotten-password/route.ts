import { fieldValidator } from "@/helper/fieldValidator";
import Hotel from "@/model/hotels.model";
import bcrypt from "bcryptjs";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    if (request.method !== "PATCH")
      throw new ApiError(405, "invalid request method");

    const { name, otp, hotelEmail, hotelPassword } = await request.json();

    const validFields = ["hotelEmail", "name", "otp", "hotelPassword"];
    const requestedFields = { hotelEmail, name, otp, hotelPassword };

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

    if (hotelExists.otp !== otp) throw new ApiError(400, "invalid otp");

    let newHashedPassword = await bcrypt.hash(hotelPassword, 10);

    const passwordUpdtHtl = await Hotel.findByIdAndUpdate(hotelExists?._id, {
      $set: {
        hotelPassword: newHashedPassword,
      },
      $unset: {
        otp: 1,
      },
    }).select("-_id -password -__v -createdAt -updatedAt");

    if (!passwordUpdtHtl)
      throw new ApiError(500, "password updation unsuccessful");

    return NextResponse.json(
      { message: "password of hotel updated successfully", success: true },
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
