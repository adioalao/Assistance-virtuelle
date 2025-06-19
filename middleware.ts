import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET, cookieName: "next-auth.session-token" });
  console.log("TOKEN =", token);
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

/* export const config = {
  matcher: ["/"], // tu peux ajouter plus de routes ici si besoin
}; */


export const config = {
  matcher: ["/((?!auth|_next|favicon.ico).*)"],
};