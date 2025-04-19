import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { betterFetch } from "@better-fetch/fetch";
import { type Session } from "../../server/src/db/schema/auth";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
    },
  });

  console.log("session: ", session);
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
