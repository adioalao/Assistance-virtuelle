import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token",
  });

  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  // Non connecté : rediriger vers /auth/login
  if (!token) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }


  // 🔐 Règles de protection selon les rôles
  if (pathname.startsWith("/backoffice") && token.role !== "admin") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/frontoffice") && token.role !== "user") {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur va sur la racine /
  if (req.nextUrl.pathname === "/") {
    if (token.role === "admin") {
      url.pathname = "/backoffice/Dashboard";
      return NextResponse.redirect(url);
    } else if (token.role === "user") {
      url.pathname = "/frontoffice";
      return NextResponse.redirect(url);
    } else {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Appliquer le middleware à toutes les routes sauf auth, static et Next.js internals
export const config = {
  matcher: ["/((?!auth|api/auth|_next|favicon.ico|public).*)"],
};