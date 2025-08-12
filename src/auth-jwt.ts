import NextAuth from "next-auth"
import authConfig from "./auth.config"

export const { auth } = NextAuth({
   session: {
      strategy: "jwt",
      maxAge: 60 * 20,
   },
   ...authConfig
})