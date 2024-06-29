import jwt from "jsonwebtoken";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export const tokenDecrypter = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    if (!token) throw new ApiError(401, "unauthorized user");

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    // console.log("decryptedToken", decryptedToken);
    return decryptedToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
