import { PrismaClient } from '@prisma/client'
import Fuse from 'fuse.js'

const prisma = new PrismaClient()

export const faqService = {
	async getAll() {
		return prisma.question.findMany({
			where: { isFaq: true },
			include: { reponse: true, faq: true },
			orderBy: { createdAt: 'desc' },
		})
	},

	async getGroupedByFaq() {
		const groups = await prisma.faq.findMany({
			include: {
				questions: {
					where: { isFaq: true },
					include: { reponse: true },
					orderBy: { createdAt: 'desc' },
				},
			},
			orderBy: { createdAt: 'desc' },
		})
		return groups
	},

	async addFaq(contenu: string, reponse: string, faqId?: number, createdByAdmin = true) {
		return prisma.question.create({
			data: {
				contenu,
				isFaq: true,
				createdByAdmin,
				faqId,
				reponse: { create: { contenu: reponse } },
			},
			include: { reponse: true, faq: true },
		})
	},

	async updateFaq(id: number, newContenu: string, newReponse: string, newFaqId?: number) {
		await prisma.reponse.update({
			where: { questionId: id },
			data: { contenu: newReponse },
		})

		return prisma.question.update({
			where: { id },
			data: { contenu: newContenu, faqId: newFaqId },
			include: { reponse: true, faq: true },
		})
	},

	async deleteFaq(id: number) {
		await prisma.reponse.delete({ where: { questionId: id } })
		return prisma.question.delete({ where: { id } })
	},

	async fuzzySearch(message: string) {
		const faqs = await prisma.question.findMany({
			where: { isFaq: true },
			include: { reponse: true, faq: true },
		})

		const fuse = new Fuse(faqs, {
			keys: ['contenu', 'faq.titre'],
			threshold: 0.3,
		})

		const result = fuse.search(message)

		if (result.length > 0) {
			return result[0].item
		}

		return null
	}
}