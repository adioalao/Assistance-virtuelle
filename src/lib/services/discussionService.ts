import { PrismaClient, AuthorType } from "@prisma/client";

const prisma = new PrismaClient();

export const discussionService = {
   async createDiscussion(
      userId: number,
      title: string,
      messages: { content: string; authorType: AuthorType; questionId?: number }[]
   ) {
      if (!userId || !title || !Array.isArray(messages) || messages.length === 0) {
         throw new Error("Paramètres invalides pour la création de la discussion.");
      }

      for (const message of messages) {
         if (!message.content || !message.authorType) {
            throw new Error("Chaque message doit avoir un contenu et un auteur.");
         }
      }

      return prisma.chatSession.create({
         data: {
            title,
            userId,
            messages: {
               create: messages.map((m) => ({
                  content: m.content,
                  authorType: m.authorType,
                  ...(m.questionId ? { question: { connect: { id: m.questionId } } } : {}),
               })),
            },
         },
      });
   },

   async getSessionById(id: number) {
      if (!id || typeof id !== "number") {
         throw new Error("Identifiant de session invalide.");
      }

      return prisma.chatSession.findUnique({
         where: { id },
         include: {
            messages: {
               orderBy: { authorType: "asc" },
               select: {
                  id: true,
                  content: true,
                  authorType: true,
                  createdAt: true,
                  questionId: true,
               },
            },
            /*  user: {
                select: {
                   name: true,
                   email: true,
                },
             }, */
         },
      });
   },
};