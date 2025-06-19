import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { idChatroom: string } }
) {
  const { idChatroom } = params;

  console.log('id', idChatroom);

  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const chatroomWithMessage = await prisma.chatroom.findUnique({
      where: {
        id: Number(idChatroom)
      },
      include: {
        message: true
      }
    });

    console.log('Chatroom récupérée :', chatroomWithMessage);
    return NextResponse.json({ chatroomWithMessage });
  } catch (error) {
    console.error('[HISTORY_GET]', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }

}
