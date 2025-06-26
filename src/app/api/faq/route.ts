import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/lib/services/faqService'

export async function GET() {
	try {
		const faqs = await faqService.getAll()
		if (!faqs) {
			return NextResponse.json(
				{ reponse: "FAQ introuvable" },
				{ status: 404 }
			);
		}
		return NextResponse.json(faqs, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: "Erreur lors de la récuperation des données" }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	const { title } = await req.json()
	try {
		if (!title) {
			return NextResponse.json({ error: "Contenu vide" }, { status: 400 })
		}
		const test = (await faqService.getFaqByTitle(title)).map(t => t.title.toLowerCase())
		if (test.includes(title.toLowerCase())) {
			return NextResponse.json({ error: "Ce title est déjà utilisé pour une faq" }, { status: 400 })
		}
		const faq = await faqService.addFaq(title)
		return NextResponse.json(faq, { status: 201 })
	} catch (error) {
		return NextResponse.json({ error: "Erreur server lors de soumission" }, { status: 500 })
	}
}
