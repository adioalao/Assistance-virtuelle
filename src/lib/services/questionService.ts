import { PrismaClient, QuestionStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const questionService = {
   async getAll() {
      return prisma.question.findMany({
         include: { answer: true, faqGroup: true, user: true, message: true },
      });
   },

   async getById(id: number) {
      return prisma.question.findUnique({
         where: { id },
         include: { answer: true, faqGroup: true, user: true, message: true },
      });
   },

   async getApproved() {
      return prisma.question.findMany({
         where: { status: 'approved' },
         include: { answer: true },
      });
   },
   async getRejected() {
      return prisma.question.findMany({
         where: { status: 'rejected' },
         include: { answer: true },
      });
   },
   async getProvisional() {
      return prisma.question.findMany({
         where: { status: 'provisional' },
         include: { answer: true },
      });
   },

   async createQuestionWithAnswer(data: {
      content: string
      answerContent?: string
      userId?: number
      faqGroupId?: number
      messageId?: number
      status?: QuestionStatus
   }) {
      return prisma.question.create({
         data: {
            content: data.content,
            status: data.status || 'provisional',
            userId: data.userId,
            faqGroupId: data.faqGroupId,
            messageId: data.messageId,
            answer: data.answerContent
               ? { create: { content: data.answerContent } }
               : undefined,
         },
         include: { answer: true },
      });
   },

   async updateQuestionAndAnswer(id: number, data: {
      content?: string
      status?: QuestionStatus
      answerContent?: string
   }) {
      // 1. Mettre à jour la question
      const updatedQuestion = await prisma.question.update({
         where: { id },
         data: {
            content: data.content,
            status: data.status,
         },
         include: { answer: true },
      });

      // 2. Mettre à jour ou créer la réponse si nécessaire
      if (data.answerContent !== undefined) {
         if (updatedQuestion.answer) {
            await prisma.answer.update({
               where: { questionId: id },
               data: { content: data.answerContent },
            });
         } else {
            await prisma.answer.create({
               data: {
                  content: data.answerContent,
                  questionId: id,
               },
            });
         }
      }

      return this.getById(id); // Retourner la question à jour
   },

   async delete(id: number) {
      await prisma.answer.deleteMany({ where: { questionId: id } });
      return prisma.question.delete({ where: { id } });
   },
};