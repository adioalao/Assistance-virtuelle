import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./schemas";

const authConfig: NextAuthConfig = {
   providers: [
      GitHubProvider({}),
      CredentialsProvider({
         name: "credentials",
         credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) {
               return null;
            }
            const validatedCredentials = LoginSchema.parse(credentials)
            const user = await prisma.user.findUnique({
               where: {
                  username: validatedCredentials.username,
               },
               include: { role: true },
            });
            if (!user || !user.password) return null;
            const isValid = await bcrypt.compare(validatedCredentials.password, user.password);
            if (!isValid) return null;
            return {
               id: user.id.toString(),
               name: user.name,
               email: user.email,
               role: user.role?.name ?? "",
            };
         },
      }),
   ],
   pages: {
      signIn: "/auth/login",
      error: "/auth/error",
   },
   session: {
      strategy: "database",
      maxAge: 60 * 20,
   },
   secret: process.env.NEXTAUTH_SECRET,
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token.sub = user.id;
            token.role = user.role;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.sub!;
            session.user.role = token.role as string;
         }
         return session;
      },
   },
};

export default authConfig;