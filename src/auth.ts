import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"

export const { auth, handlers, signIn } = NextAuth({
   adapter: PrismaAdapter(prisma),
   session: { strategy: "database" },
   ...authConfig
})