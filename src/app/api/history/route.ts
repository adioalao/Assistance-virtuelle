import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth-jwt";

export async function GET() {
   const session = await auth()

   if (!session?.user?.username) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
   }

   const user = await prisma.user.findFirst({
      where: { username: session.user.username },
   });

   if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
   }

   const sessions = await prisma.chatSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
         id: true,
         title: true,
         createdAt: true,
      },
   });

   return NextResponse.json(sessions);
}