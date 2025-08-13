import { NextResponse } from "next/server";
import { auth } from "./auth-jwt";

// Définir les routes par rôle
const ROLE_ROUTES = {
   admin: ["/backoffice"],
   user: ["/frontoffice"],
} as const;

// Pages publiques accessibles sans authentification
const PUBLIC_ROUTES = ["/auth/login", "/auth/error"];

// Pages d'accueil par défaut par rôle
const DEFAULT_PAGES = {
   admin: "/backoffice/dashboard",
   user: "/frontoffice",
} as const;

export default auth((req) => {

   /*
      const { nextUrl } = req;
   
      const isLoggedIn = Boolean(req.auth);
      const userRole = req.auth?.user?.role as keyof typeof DEFAULT_PAGES | undefined;
   
      console.log("Middleware exécuté :", req.auth);
   
      const pathname = nextUrl.pathname;
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isLoginPage = pathname === "/auth/login";
   
      console.log(
         `isLoggedIn: ${isLoggedIn}, userRole: ${userRole}, isPublicRoute: ${isPublicRoute}, isLoginPage: ${isLoginPage}`
      );
   
      // 🔹 Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
      if (!isLoggedIn && !isPublicRoute) {
         return NextResponse.redirect(new URL("/auth/login", nextUrl));
      }
   
      // 🔹 Si l'utilisateur est connecté et essaie d'aller sur la page de login
      if (isLoggedIn && isLoginPage) {
         const defaultPage = userRole ? DEFAULT_PAGES[userRole] : "/";
         return NextResponse.redirect(new URL(defaultPage, nextUrl));
      }
   
      // 🔹 Vérification des permissions par rôle (décommentée et sécurisée)
      if (isLoggedIn && userRole) {
         const allowedRoutes = ROLE_ROUTES[userRole] || [];
         const hasAccess =
            allowedRoutes.some((route) => pathname.startsWith(route)) ||
            isPublicRoute;
   
         if (!hasAccess) {
            const defaultPage = DEFAULT_PAGES[userRole] || "/";
            return NextResponse.redirect(new URL(defaultPage, nextUrl));
         }
      }
   
      return NextResponse.next();
   
   */
});

export const config = {
   matcher: ["/((?!api/auth|_next|favicon.ico).*)"],
};