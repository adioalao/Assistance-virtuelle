import { PrismaClient, AuthorType } from "@prisma/client";

const prisma = new PrismaClient();

export const discussionService = {
   async createDiscussion(userEmail: string, messages: { content: string; authorType?: AuthorType; createdAt?: string }[], title?: string) {
      const user = await prisma.user.findUnique({
         where: { email: userEmail },
      });

      if (!user) {
         throw new Error("Utilisateur introuvable");
      }

      // Création de la session
      const session = await prisma.chatSession.create({
         data: {
            title: title ?? messages[0]?.content?.slice(0, 30),
            userId: user.id,
         },
      });

      // Création des messages liés à cette session
      const created = await prisma.message.createMany({
         data: messages.map((msg) => ({
            content: msg.content,
            authorType: msg.authorType ?? "user",
            chatSessionId: session.id,
            createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date(),
         })),
      });

      return {
         sessionId: session.id,
         messagesCreated: created.count,
      };
   },
   async getDiscussionById(sessionId: number, userEmail: string) {
      const user = await prisma.user.findUnique({
         where: { email: userEmail },
         select: { id: true },
      });

      if (!user) throw new Error("Utilisateur non trouvé");

      const session = await prisma.chatSession.findUnique({
         where: {
            id: sessionId,
            userId: user.id,
         },
         include: {
            messages: {
               orderBy: { createdAt: "asc" },
            },
         },
      });

      if (!session) throw new Error("Session introuvable ou accès non autorisé");

      return session;
   },
};