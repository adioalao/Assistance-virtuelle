import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const { id, contenu, reponse } = await request.json();

        if (!id || (typeof contenu !== 'string' && typeof reponse !== 'string')) {
            return NextResponse.json({ error: 'id et contenu ou reponse requis' }, { status: 400 });
        }

        if (contenu) {
            await prisma.question.update({
                where: { id },
                data: { contenu },
            });
        }

        if (reponse) {
            await prisma.reponse.updateMany({
                where: { questionId: id },
                data: { contenu: reponse }
            });
        }

        const question = await prisma.question.findUnique({
            where: { id },
            include: { reponse: true }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}