import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export { default } from "next-auth/middleware";

import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow access to public pages and redirect protected pages without a token
  if (
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify") ||
    (!token &&
      (url.pathname.startsWith("/") || url.pathname.startsWith("/dashboard")))
  ) {
    return NextResponse.next(); // Allow access
  }

  // Redirect authenticated users to the dashboard from other protected pages
  if (token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to the home page
  return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
