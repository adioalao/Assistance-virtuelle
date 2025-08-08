import { NextRequest, NextResponse } from "next/server";
import * as tt from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import { discussionService } from "@/lib/services/discussionService";



export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
      const { id } = await params;
      const sessionId = parseInt(id, 10);
      if (isNaN(sessionId)) {
         return NextResponse.json({ error: "ID de session invalide" }, { status: 400 });
      }
      const data = await discussionService.getSessionById(sessionId);

      if (!data) {
         return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
      }

      return NextResponse.json({ success: true, session: data });
   } catch (error: any) {
      console.error("Erreur GET /api/discussion/[id]:", error);
      return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
   }
}

2
export async function DELETE(
   req: NextRequest,
   { params }: { params: { id: string } }
) {
   const session = await getServerSession(authOptions)
   if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
   }

   const { id } = await params;
   const sessionId = parseInt(id, 10);

   try {
      const deleted = discussionService.deleteSessionById(sessionId)
      return NextResponse.json(deleted)
   } catch (error) {
      return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
   }
}