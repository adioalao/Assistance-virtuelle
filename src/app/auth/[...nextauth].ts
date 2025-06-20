import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Intégration du modèle Prisma standard

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Aucun utilisateur trouvé");
          return null;
        }

        //  Recherche de l'utilisateur par email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        console.log("utilisateur", user);


        if (!user || !user.password) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log("Mot de passe invalide", isValid);
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    //   async jwt({ token, user }: { token: JWT; user?: any }) {
    //     if (user) {
    //       token.id = user.id;
    //     }
    //     return token;
    //   },

    //   async session({ session, token }: { session: Session; token: JWT }) {
    //     if (token?.id) {
    //       (session as any).userId = token.id;
    //     }
    //     return session;
    //   },
    // },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  }
};

export default NextAuth(authOptions);
