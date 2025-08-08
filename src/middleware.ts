import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
   const session = await auth();
   const { pathname } = request.nextUrl;
   const isPublic =
      pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/error") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.startsWith("/images");

   // Si la route est publique, on laisse passer
   if (isPublic) return NextResponse.next();
   // Si pas authentifié, on redirige vers /auth/login
   if (!session?.user) {
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
   }

   return NextResponse.next();
}

export const config = {
   matcher: ["/((?!api/auth|_next|favicon.ico|auth/login).*)"],
};