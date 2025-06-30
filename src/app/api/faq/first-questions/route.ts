import { NextResponse } from 'next/server';
import { faqService } from '@/lib/services/faqService';

export async function GET() {
   try {
      const questions = await faqService.getFirstQuestionsFromAllFaqs(10);
      if (!questions || questions.length === 0) {
         return NextResponse.json({ message: 'Aucune question trouvée' }, { status: 404 });
      }
      return NextResponse.json(questions, { status: 200 });
   } catch (error) {
      console.error("Erreur API /faq/first-questions :", error);
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
   }
}