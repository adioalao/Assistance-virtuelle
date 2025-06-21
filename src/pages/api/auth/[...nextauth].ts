
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),

	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "john@example.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
					include: { role: true }, // Chargement du  rôle
				});

				if (!user || !user.password) return null;

				const isValid = await bcrypt.compare(credentials.password, user.password);
				if (!isValid) return null;

				return {
					id: user.id.toString(),
					name: user.name,
					email: user.email,
					role: user.role?.name, // 👈 Inclure le nom du rôle
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
		maxAge: 60 * 20
	},

	secret: process.env.NEXTAUTH_SECRET,

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id.toString();
				token.role = (user as any).role; // 👈 Ajout du rôle au token
			}
			return token;
		},

		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.sub!;
				session.user.role = token.role as string; //  Ajout du rôle à la session
			}
			return session;
		},
	},
};

export default NextAuth(authOptions);