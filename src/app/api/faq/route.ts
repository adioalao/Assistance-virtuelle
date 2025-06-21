import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type QuestionWithChildren = {
  id: number;
  contenu: string;
  reponse: { contenu: string } | null;
  children: QuestionWithChildren[];
};

async function fetchQuestionWithChildren(parentId: number | null = null): Promise<QuestionWithChildren[]> {
  const questions = await prisma.question.findMany({
    where: { parentId },
    include: {
      reponse: true,
    },
  });

  return Promise.all(
    questions.map(async (q) => ({
      id: q.id,
      contenu: q.contenu,
      reponse: q.reponse ? { contenu: q.reponse.contenu } : null,
      children: await fetchQuestionWithChildren(q.id),
    }))
  );
}

export async function GET() {
  try {
    const fullTree = await fetchQuestionWithChildren(null);
    return NextResponse.json(fullTree);
  } catch (error) {
    console.error('Erreur lors de la récupération des questions :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
