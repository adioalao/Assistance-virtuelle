import { NextRequest, NextResponse } from 'next/server';
import { faqService } from '@/lib/services/faqService';
import Fuse from 'fuse.js';

export async function POST(req: NextRequest) {
   try {
      const { message } = await req.json();

      if (!message || typeof message !== 'string') {
         return NextResponse.json(
            { error: 'Message invalide' },
            { status: 400 }
         );
      }

      const allFaqs = await faqService.getAll();

      // Extraire les questions principales (celles avec orderInChat = 0 ou 1ere question de chaque FAQ)
      const mainQuestions = allFaqs
         .map((faq) => faq.questions.find((q) => q.orderInChat === 0 || q.orderInChat === faq.questions[0]?.orderInChat))
         .filter(Boolean);

      const fuse = new Fuse(mainQuestions, {
         keys: ['content'],
         threshold: 0.3,
      });

      const results = fuse.search(message).slice(0, 10);

      const matched = results.map((r) => r.item);

      return NextResponse.json(matched);
   } catch (err) {
      console.error('Erreur Fuse.js backend:', err);
      return NextResponse.json(
         { error: 'Erreur serveur lors de la recherche' },
         { status: 500 }
      );
   }
}