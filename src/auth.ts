import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import authConfig from "./auth.config"

export const { auth, handlers, signIn } = NextAuth({
   adapter: PrismaAdapter(prisma),
   session: { strategy: "database" },
   ...authConfig
   // providers: [
   //    GitHub,
   //    CredentialsProvider({
   //       name: "credentials",
   //       credentials: {
   //          username: { label: "Username", type: "text" },
   //          password: { label: "Password", type: "password" },
   //       },
   //       authorize: async (credentials) => {
   //          if (!credentials?.username || !credentials?.password) {
   //             return null;
   //          }
   //          const user = await prisma.user.findUnique({
   //             where: { username: credentials.username as string },
   //             include: { role: true },
   //          });

   //          if (!user || !user.password) return null;

   //          const isValid = bcrypt.compare(credentials.password as string, user.password);
   //          if (!isValid) return null;

   //          return {
   //             id: user.id.toString(),
   //             name: user.name,
   //             email: user.email,
   //             role: user.role?.name ?? "", // Ensure role is always a string
   //          };
   //       }
   //    })
   // ],
   // pages: {
   //    signIn: "/auth/login",
   //    error: "/auth/error",
   // },

   // session: {
   //    strategy: "jwt",
   //    maxAge: 60 * 20
   // },

   // secret: process.env.NEXTAUTH_SECRET,

   // callbacks: {
   //    async jwt({ token, user }) {
   //       if (user) {
   //          token.sub = user.id.toString();
   //          token.role = (user as any).role; // 👈 Ajout du rôle au token
   //       }
   //       return token;
   //    },

   //    async session({ session, token }) {
   //       if (session.user) {
   //          session.user.id = token.sub!;
   //          session.user.role = token.role as string; //  Ajout du rôle à la session
   //       }
   //       return session;
   //    },
   // },
})