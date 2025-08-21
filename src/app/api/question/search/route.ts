import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
   const query = req.nextUrl.searchParams.get('q') || '';
   if (!query) return NextResponse.json([]);

   // Full-Text Search PostgreSQL
   const results = await prisma.$queryRaw`
    SELECT
      q.id,
      q.content,
      a.content AS answer,
      ts_rank(q.question_tsv, plainto_tsquery('french', ${query})) AS rank
    FROM "Question" q
    LEFT JOIN "Answer" a ON a."questionId" = q.id
    WHERE q.question_tsv @@ plainto_tsquery('french', ${query})
    ORDER BY rank DESC
    LIMIT 20;
  `;

   return NextResponse.json(results);
}