import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { discussionService } from "@/lib/services/discussionService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      const { title, messages } = await req.json();

      if (!Array.isArray(messages) || messages.length === 0) {
         return NextResponse.json({ error: "Messages manquants ou invalides" }, { status: 400 });
      }

      // Récupérer l'utilisateur par email pour obtenir son id
      const user = await prisma.user.findUnique({
         where: { email: session.user.email },
         select: { id: true }
      });

      if (!user) {
         return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
      }

      const result = await discussionService.createDiscussion(
         user.id,
         title,
         messages
      );

      return NextResponse.json({ success: true, sessionId: result.id });
   } catch (error: any) {
      console.error("Erreur POST /api/discussion:");
      return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
   }
}