
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]";



export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      )
    }

    const { text } = await req.json()
    
    const userId = session.user.id

    const idChatroomSelected = undefined

    let chatroom = await prisma.chatroom.findMany({
      where: { idUser: Number(userId) },
      orderBy: { createdAt: 'desc' }
    })

   // console.log(chatroom);
    if (idChatroomSelected )
    {
      const newMessage = await prisma.message.create({
          data: {
            content: text,
            //senderId: Number(userId),
            idChatroom: idChatroomSelected
          }
        })

        return NextResponse.json({
          success: true,
          newChatroom: false,
          chatroomId: chatroom[0].id,
          message: newMessage
        })
    }
    else {
      if (chatroom && chatroom.length>0 ) {
        const newMessage = await prisma.message.create({
          data: {
            content: text,
            //senderId: Number(userId),
            idChatroom: chatroom[0].id
          }
        })

        return NextResponse.json({
          success: true,
          newChatroom: false,
          chatroomId: chatroom[0].id,
          message: newMessage
        })
      }
      else {
        let newChatroom = await prisma.chatroom.create({
          data: {
            idUser: Number (userId),
            status: 'actif',
            titre: text
          }
        })
        const newMessage = await prisma.message.create({
          data: {
            content: text,
          // senderId: userId,
            idChatroom: newChatroom.id
          }
        })

        return NextResponse.json({
          success: true,
          newChatroom : newChatroom,
          chatroomId: newChatroom.id,
          message: newMessage
        })

      }
    }

  }
  catch (error) {
    console.error("[CHAT_POST_ERROR]", error)
    return NextResponse.json(
      {
        error: "Erreur serveur",
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const chatroomId = searchParams.get('chatroomId')
  try {
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    const chatroom = await prisma.chatroom.findFirst({
      where: {
        id: chatroomId ? parseInt(chatroomId) : undefined, // Conversion et gestion de null
        idUser: session.userId,
      }
    })

    if (!chatroom) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { idChatroom: Number() },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ messages })
  }
  catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error?.message },
      { status: 500 }
    );
  }
}