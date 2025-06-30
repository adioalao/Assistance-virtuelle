import { questionService } from "@/lib/services/questionService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
   const id = parseInt(params.id);
   const questionTree = await questionService.getTreeById(id);
   if (!questionTree) {
      return NextResponse.json({ error: "Question introuvable" }, { status: 404 });
   }
   return NextResponse.json(questionTree);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
   const id = parseInt(params.id);
   const { content, status, answerContent, faqGroupId, parentId, order } = await req.json();

   try {
      const updated = await questionService.updateQuestionAndAnswer(id, {
         content,
         status,
         answerContent,
         faqGroupId,
         parentId,
         order,
      });

      return NextResponse.json(updated);
   } catch (e) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
   }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
   const id = parseInt(params.id);

   try {
      const deleted = await questionService.delete(id);
      return NextResponse.json(deleted);
   } catch (e) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
   }
}