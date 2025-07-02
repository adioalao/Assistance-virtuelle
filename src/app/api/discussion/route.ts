import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // 🔁 adapte le chemin si besoin
import { discussionService } from "@/lib/services/discussionService";

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

      const result = await discussionService.createDiscussion(session.user.email, messages, title);

      return NextResponse.json({ success: true, ...result });
   } catch (error: any) {
      console.error("Erreur POST /api/discussions:", error);
      return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
   }
}