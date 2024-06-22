import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/sign-in" || path === "/sign-up";

  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token)
    return NextResponse.redirect(new URL("/", request.nextUrl));

  if (!isPublicPath && !token)
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/profile", "/sign-in", "/sign-up"],
};
