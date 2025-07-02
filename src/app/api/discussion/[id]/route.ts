import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // 🔁 adapte le chemin si besoin
import { discussionService } from "@/lib/services/discussionService";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }

      const sessionId = parseInt(params.id, 10);
      if (isNaN(sessionId)) {
         return NextResponse.json({ error: "ID de session invalide" }, { status: 400 });
      }

      const data = await discussionService.getDiscussionById(sessionId, session.user.email);

      return NextResponse.json({ success: true, session: data });
   } catch (error: any) {
      console.error("Erreur GET /api/discussions/[id]:", error);
      return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
   }
}