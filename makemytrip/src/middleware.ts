import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt"; // to get token in anywhere in app

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //   get token and url from req and request respectively
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    (token && url.pathname.startsWith("/sign-in")) ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } else return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
