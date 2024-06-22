import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    if (request.method !== "GET")
      return NextResponse.json(
        { message: "invalid request method" },
        { status: 405 }
      );

    const response = NextResponse.json(
      { message: "user logout successful ", success: true },
      { status: 200 }
    );

    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error: any) {
    console.error("error occured :", error);

    return NextResponse.json(
      { message: error.message || "error occured", success: false },
      { status: error.status || 500 }
    );
  }
}
