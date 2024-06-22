import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const tokenDecrypter = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);

    console.log(decryptedToken);
    return decryptedToken;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
