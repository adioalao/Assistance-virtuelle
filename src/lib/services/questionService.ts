import { PrismaClient, QuestionStatus } from "@prisma/client";

const prisma = new PrismaClient();

type QuestionTree = {
   id: number;
   content: string;
   answer: { content: string };
   order: number;
   children: QuestionTree[];
};

async function getQuestionTree(id: number): Promise<QuestionTree | null> {
   const question = await prisma.question.findUnique({
      where: { id },
      include: { answer: true },
   });
   if (!question) return null;
   const children = await prisma.question.findMany({
      where: { parentId: id },
      include: { answer: true },
   });
   return {
      id: question.id,
      content: question.content,
      answer: question.answer ? { content: question.answer.content } : { content: "" },
      order: question.order,
      children: (await Promise.all(children.map(async (child) => await getQuestionTree(child.id)))).filter((c): c is QuestionTree => c !== null),
   };
}

export const questionService = {
   // Recuperer toutes les questions et sous-questions associées
   async getAll() {
      const questions = await prisma.question.findMany({
         where: { status: 'approved', parentId: null },
         include: { answer: true },
      });
      return Promise.all(questions.map(q => getQuestionTree(q.id)));
   },
   async getById(id: number) {
      return prisma.question.findUnique({
         where: { id },
         include: {
            answer: true,
            faqGroup: true,
            user: true,
            message: true,
            parent: true,
            children: true,
         },
      });
   },

   // Recuperer toutes les questions et sous-questions associées (approuvées)
   async getApproved() {
      const questions = await prisma.question.findMany({
         where: { status: 'approved', parentId: null },
         include: { answer: true },
      });
      return Promise.all(questions.map(q => getQuestionTree(q.id)));
   },

   // Recuperer toutes les questions et sous-questions associées (rejetées)
   async getRejected() {
      const questions = await prisma.question.findMany({
         where: { status: 'rejected', parentId: null },
         include: { answer: true },
      });
      return Promise.all(questions.map(q => getQuestionTree(q.id)));
   },

   // Recuperer toutes les questions et sous-questions associées (en attente)
   async getProvisional() {
      const questions = await prisma.question.findMany({
         where: { status: 'provisional', parentId: null },
         include: { answer: true },
      });
      return Promise.all(questions.map(q => getQuestionTree(q.id)));
   },

   async createQuestionWithAnswer(data: {
      content: string;
      answerContent?: string;
      userId?: number;
      faqGroupId?: number;
      messageId?: number;
      parentId?: number;
      status?: QuestionStatus;
      order?: number;
   }) {
      return prisma.question.create({
         data: {
            content: data.content,
            status: data.status || 'provisional',
            userId: data.userId,
            faqGroupId: data.faqGroupId,
            messageId: data.messageId,
            parentId: data.parentId,
            order: data.order ?? 0,
            answer: data.answerContent
               ? { create: { content: data.answerContent } }
               : undefined,
         },
         include: { answer: true, parent: true, children: true },
      });
   },

   async updateQuestionAndAnswer(
      id: number,
      data: {
         content?: string;
         status?: QuestionStatus;
         answerContent?: string;
         faqGroupId?: number;
         parentId?: number;
         order?: number;
      }
   ) {
      // 1. Mettre à jour la question
      const updatedQuestion = await prisma.question.update({
         where: { id },
         data: {
            content: data.content,
            status: data.status,
            faqGroupId: data.faqGroupId,
            parentId: data.parentId,
            order: data.order,
         },
         include: { answer: true, parent: true, children: true },
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
      async function deleteQuestionRecursive(id: number) {
         // Supprimer récursivement les sous-questions
         const children = await prisma.question.findMany({ where: { parentId: id } });
         for (const child of children) {
            await deleteQuestionRecursive(child.id);
         }
         // Supprimer la réponse liée si elle existe
         await prisma.answer.deleteMany({ where: { questionId: id } });
         // Supprimer la question elle-même
         await prisma.question.delete({ where: { id } });
      }

      await deleteQuestionRecursive(id);
      return { success: true };
   },

   async getTreeById(id: number) {
      return getQuestionTree(id);
   },
};