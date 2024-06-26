import dbConnect from "@/lib/dbConnect";
import Hotel from "@/model/hotels.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

// what we want to do is first we'll check that if the user is authorised and what not basic validations
// then we need to check if the person loggedin is the real owner or admin of the hotel account
// if yes then only we'll let the user disable the hotel account

// or

// we can keep the hotel as an entity itself with keeping a password
// THIS ISN'T COMPLETE AND WE'LL DEAL WITH IT LATER

async function PATCH(request: Request) {
  await dbConnect();

  try {
    if (request.method !== "PATCH")
      throw new ApiError(405, "invalid request method");

    const id = "";

    const deacitvateUser = await Hotel.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
        },
      },
      { new: true }
    );

    if (!deacitvateUser.isActive)
      return NextResponse.json(
        { message: "user not found to deactivate", success: false },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "user deactivation successful", success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.status || 500 }
    );
  }
}
