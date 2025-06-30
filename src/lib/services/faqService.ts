import { PrismaClient } from '@prisma/client'
import Fuse from 'fuse.js'

const prisma = new PrismaClient()

export const faqService = {
	async getAll() {
		return await prisma.faqGroup.findMany({
			include: {
				questions: {
					include: { answer: true },
					orderBy: { orderInChat: 'asc' },
					where: { status: 'approved' }
				}
			},
			orderBy: { createdAt: 'desc' }
		})
	},

	async getFaqById(id: number) {
		return await prisma.faqGroup.findUnique({
			where: { id },
			include: {
				questions: {
					include: { answer: true },
					orderBy: { createdAt: 'desc' },
					where: { status: 'approved' }
				},
			},
		})
	},

	async getFaqByTitle(title: string) {
		return await prisma.faqGroup.findMany({
			where: { title },
			select: { title: true }
		})
	},

	async getFirstQuestionsFromAllFaqs(limit = 10) {
		const groups = await prisma.faqGroup.findMany({
			include: {
				questions: {
					where: { status: 'approved' },
					orderBy: { orderInChat: 'asc' },
					take: 1,
					include: { answer: true },
				}
			},
			orderBy: { createdAt: 'desc' },
			take: limit,
		});

		// On ne garde que les groupes avec au moins une question
		return groups
			.filter(group => group.questions.length > 0)
			.map(group => ({
				faqId: group.id,
				faqTitle: group.title,
				...group.questions[0], // On retourne la première question avec sa réponse
			}));
	},

	async addFaq(title: string) {
		return prisma.faqGroup.create({
			data: {
				title
			}
		})
	},

	async updateFaq(id: number, title: string) {
		return prisma.faqGroup.update({
			where: { id },
			data: {
				title
			}
		})
	},


	async deleteFaqWithQuestion(id: number) {
		// 1. Récupérer les IDs des questions liées à la FAQ
		const questions = await prisma.question.findMany({
			where: { faqGroupId: id },
			select: { id: true },
		})

		const questionIds = questions.map(q => q.id)

		// 2. Supprimer les réponses liées à ces questions
		if (questionIds.length > 0) {
			await prisma.answer.deleteMany({
				where: { questionId: { in: questionIds } },
			})
		}

		// 3. Supprimer les questions de la FAQ
		await prisma.question.deleteMany({
			where: { faqGroupId: id },
		})

		// 4. Supprimer la FAQ
		return prisma.faqGroup.delete({
			where: { id },
		})
	},
	async deleteFaqWithOutQuestion(id: number) {
		//  1. Détachées questions liées à la FAQ
		const questions = await prisma.question.findMany({
			where: { faqGroupId: id },
			select: { id: true },
		})

		const questionIds = questions.map(q => q.id)

		// 2. Supprimer les questions de la FAQ
		await prisma.question.updateMany({
			where: { faqGroupId: id },
			data: { faqGroupId: null }
		})

		// 3. Supprimer la FAQ
		return prisma.faqGroup.delete({
			where: { id },
		})
	},

	async fuzzySearch(message: string) {
		const faqs = await prisma.question.findMany({
			where: { status: 'approved' }, // seulement questions validées
			include: { answer: true, faqGroup: true },
		})

		const fuse = new Fuse(faqs, {
			keys: ['content', 'faqGroup.title'],
			threshold: 0.3,
		})

		const result = fuse.search(message)

		if (result.length > 0) {
			return result[0].item
		}

		return null
	},
}