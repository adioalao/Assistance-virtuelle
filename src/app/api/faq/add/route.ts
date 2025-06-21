import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { contenu, reponse, parentId } = await request.json();

        if (!contenu || !reponse) {
            return NextResponse.json({ error: 'contenu et reponse sont requis' }, { status: 400 });
        }

        const question = await prisma.question.create({
            data: {
                contenu,
                parentId: parentId || null,
                reponse: {
                    create: {
                        contenu: reponse
                    }
                }
            },
            include: { reponse: true }
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de la création :', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}