import { questionService } from "@/lib/services/questionService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
   // Récupère toutes les questions racines et leurs sous-questions récursivement
   const questions = await questionService.getAll();
   return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
   const { content, answerContent, userId, faqGroupId, status, parentId, order } = await req.json();

   if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
   }

   try {
      const created = await questionService.createQuestionWithAnswer({
         content,
         answerContent,
         userId,
         faqGroupId,
         status,
         parentId,
         order,
      });

      return NextResponse.json(created, { status: 201 });
   } catch (e) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
   }
}