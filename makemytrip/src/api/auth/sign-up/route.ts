import User from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { fieldValidator } from "@/utils/fieldValidator";

export async function POST(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "POST")
      return NextResponse.json({ message: "invalid method" }, { status: 405 });

    const { email, username, password, contactNo } = await request.json();
    const requestedFields = {
      email,
      username,
      password,
      contactNo,
    };
    const validFields = ["email", "username", "password", "contactNo"];
    const invalidFields = fieldValidator(validFields, requestedFields);

    if (parseInt(invalidFields.length) > 0)
      return NextResponse.json(
        { message: `${invalidFields}` },
        { status: 400 }
      );

    const userExists = await User.findOne({ $and: [{ email }, { username }] });

    if (userExists)
      return NextResponse.json(
        { message: `user already exists with this username and email` },
        { status: 401 }
      );

    const newUser = await User.create(requestedFields);

    //

    if (!newUser)
      return NextResponse.json(
        { message: `user registeration unsuccessful` },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message:
          "user registration successful please verify user with verification mail sent to you",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: "error occured", error },
      { status: 500 }
    );
  }
}
