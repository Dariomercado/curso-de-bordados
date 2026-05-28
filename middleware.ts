import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authSecret } from "@/lib/auth/secret";

function buildLoginRedirect(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: authSecret,
  });

  if (!token) {
    return buildLoginRedirect(request);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    token.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/mi-cuenta", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mi-cuenta/:path*", "/mis-cursos/:path*", "/admin/:path*"],
};
