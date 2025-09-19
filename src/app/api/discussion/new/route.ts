
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth-jwt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
   try {
      const session = await auth();
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
         where: { email: session.user.email },
      });

      if (!user) {
         return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
      }

      const chat = await prisma.chatSession.create({
         data: {
            userId: user.id,
            title: "Nouvelle discussion",
         },
      });

      return NextResponse.json({ success: true, sessionId: chat.id });
   } catch (error) {
      console.error("Erreur création discussion:", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
   }
}