import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET() {
   const session = await getServerSession(authOptions);

   if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
   }

   const user = await prisma.user.findUnique({
      where: { email: session.user.email },
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