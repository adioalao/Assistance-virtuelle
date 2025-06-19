
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Récupérer la session via NextAuth
    const session:any = await getServerSession(authOptions);
    console.log(session);
    
    if (session) {
      const userId = session.userId;

       let chatroom = await prisma.chatroom.findMany({
           where: { idUser: userId,},
               orderBy: { createdAt: 'desc' }

       });
      // console.log("historiq :", chatroom);  // Afficher la session dans la console
      return NextResponse.json({ message: "history user", chatroom });
    }

    // Si la session est inexistante ou expirée
    return NextResponse.json({ message: "Utilisateur non authentifié" }, { status: 401 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la session :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Vérifier si l'historique existe déjà
    let chatroom = await prisma.chatroom.findFirst({
      where: { idUser: userId, status: 'active' },
    });
    return NextResponse.json(chatroom);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du chatroom' }, { status: 500 });
  }
}

