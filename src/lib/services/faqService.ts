import { PrismaClient } from '@prisma/client';
import Fuse from 'fuse.js';

const prisma = new PrismaClient();

type QuestionTree = {
	id: number;
	content: string;
	answer: { contenu: string };
	order: number;
	children: QuestionTree[];
};

type FaqTree = {
	id: number;
	title: string;
	questions: QuestionTree[];
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
		orderBy: { order: 'asc' },
	});

	return {
		id: question.id,
		content: question.content,
		answer: question.answer ? { contenu: question.answer.content } : { contenu: '' },
		order: question.order,
		children: (await Promise.all(children.map(async (child) => await getQuestionTree(child.id)))).filter((c): c is QuestionTree => c !== null),
	};
}

export const faqService = {
	async getAll(): Promise<FaqTree[]> {
		const faqs = await prisma.faqGroup.findMany({ orderBy: { createdAt: 'desc' } });
		return Promise.all(
			faqs.map(async (faq) => {
				const roots = await prisma.question.findMany({
					where: { faqGroupId: faq.id, parentId: null, status: 'approved' },
					orderBy: { order: 'asc' },
				});
				const questions = await Promise.all(roots.map((q) => getQuestionTree(q.id)));
				return {
					id: faq.id,
					title: faq.title,
					questions: questions.filter((q): q is QuestionTree => q !== null),
				};
			})
		);
	},

	async getFaqById(id: number): Promise<FaqTree | null> {
		const faq = await prisma.faqGroup.findUnique({ where: { id } });
		if (!faq) return null;

		const roots = await prisma.question.findMany({
			where: { faqGroupId: id, parentId: null, status: 'approved' },
			orderBy: { order: 'asc' },
		});
		const questions = await Promise.all(roots.map((q) => getQuestionTree(q.id)));

		return {
			id: faq.id,
			title: faq.title,
			questions: questions.filter((q): q is QuestionTree => q !== null),
		};
	},

	async getFaqByTitle(title: string) {
		return await prisma.faqGroup.findMany({
			where: { title },
			select: { title: true },
		});
	},

	async getFirstQuestionsFromAllFaqs(limit = 10) {
		const groups = await prisma.faqGroup.findMany({
			include: {
				questions: {
					where: { status: 'approved', parentId: null },
					orderBy: { order: 'asc' },
					take: 1,
					include: { answer: true },
				},
			},
			orderBy: { createdAt: 'desc' },
			take: limit,
		});

		return groups
			.filter((group) => group.questions.length > 0)
			.map((group) => ({
				faqId: group.id,
				faqTitle: group.title,
				...group.questions[0],
			}));
	},

	async addFaq(title: string) {
		return prisma.faqGroup.create({ data: { title } });
	},

	async updateFaq(id: number, title: string) {
		return prisma.faqGroup.update({ where: { id }, data: { title } });
	},

	async deleteFaqWithQuestion(id: number) {
		async function deleteQuestionRecursive(qid: number) {
			const children = await prisma.question.findMany({ where: { parentId: qid } });
			for (const child of children) {
				await deleteQuestionRecursive(child.id);
			}
			await prisma.answer.deleteMany({ where: { questionId: qid } });
			await prisma.question.delete({ where: { id: qid } });
		}

		const questions = await prisma.question.findMany({ where: { faqGroupId: id }, select: { id: true } });
		for (const { id: qid } of questions) {
			await deleteQuestionRecursive(qid);
		}

		return prisma.faqGroup.delete({ where: { id } });
	},

	async deleteFaqWithOutQuestion(id: number) {
		await prisma.question.updateMany({
			where: { faqGroupId: id },
			data: { faqGroupId: null },
		});
		return prisma.faqGroup.delete({ where: { id } });
	},

	async fuzzySearch(message: string) {
		const faqs = await prisma.question.findMany({
			where: { status: 'approved' },
			include: { answer: true, faqGroup: true },
		});

		const fuse = new Fuse(faqs, {
			keys: ['content', 'faqGroup.title'],
			threshold: 0.3,
		});

		const result = fuse.search(message);
		if (result.length > 0) {
			return result[0].item;
		}
		return null;
	},
};