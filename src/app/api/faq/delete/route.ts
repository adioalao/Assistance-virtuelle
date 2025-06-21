import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Liste d\'ids requise' }, { status: 400 });
        }

        await prisma.reponse.deleteMany({
            where: { questionId: { in: ids } }
        });

        const result = await prisma.question.deleteMany({
            where: { id: { in: ids } }
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}