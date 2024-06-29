import { tokenDecrypter } from "@/helper/tokenDecrypter.helper";
import RoomType from "@/model/roomType.model";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    if (request.method !== "POST")
      throw new ApiError(405, "invalid request method");

    const tokenData: any = await tokenDecrypter(request);

    if (!tokenData || !tokenData?._id)
      throw new ApiError(401, "unauthorized user");
  } catch (error: any) {
    console.log("error occured :", error?.message);
  }
}
