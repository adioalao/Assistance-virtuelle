import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const prisma = new PrismaClient();

export async function POST(req: Request) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
         return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({
         where: { email: session.user.email },
      });

      if (!user) {
         return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
      }

      const { questionId } = await req.json();

      if (!questionId) {
         return NextResponse.json({ error: "ID de question requis" }, { status: 400 });
      }

      const existingSession = await prisma.chatSession.findFirst({
         where: {
            userId: user.id,
            messages: {
               some: {
                  questionId: questionId,
               },
            },
         },
      });

      if (existingSession) {
         return NextResponse.json({ exists: true, sessionId: existingSession.id });
      }

      return NextResponse.json({ exists: false });
   } catch (err) {
      console.error("[find-existing] Erreur :", err);
      return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
   }
}