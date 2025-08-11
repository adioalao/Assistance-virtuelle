// import { authOptions } from "@/app/api/auth/[...nextauth]";
// import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
   const session = await auth()
   console.log(session);

   // const session = await getServerSession(authOptions);

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