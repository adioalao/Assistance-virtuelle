import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req) => {
   const { nextUrl } = req;
   const isLoggedIn = !!req.auth

})

export const config = {
   matcher: ["/((?!api/auth|_next|favicon.ico|auth/login).*)"],
};