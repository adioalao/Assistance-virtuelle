import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/lib/services/faqService'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = await params;
	const idp = parseInt(id, 10)
	try {
		if (isNaN(idp)) {
			return NextResponse.json({ error: 'Id invalid' }, { status: 400 })
		}
		const faqs = await faqService.getFaqById(idp)
		if (!faqs) {
			return NextResponse.json({ error: 'FAQ non trouvée' }, { status: 404 })
		}
		return NextResponse.json(faqs, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: 'Erreur server lors de la récuperation' }, { status: 500 })
	}
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	const { id } = await params;
	const idp = parseInt(id, 10)
	try {
		const { title } = await req.json()
		if (!title) {
			return NextResponse.json({ error: 'Contenu vide' })
		}
		const updated = await faqService.updateFaq(idp, title)
		return NextResponse.json(updated, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: 'Erreur server lors de la mise à jour' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	const { id } = await params;
	const idp = parseInt(id, 10)

	try {
		if (isNaN(idp)) {
			return NextResponse.json({ error: 'Id invalid' }, { status: 400 })
		}
		const deleted = await faqService.deleteFaqWithOutQuestion(idp)
		if (!deleted) {
			return NextResponse.json({ error: 'FAQ non trouvée' }, { status: 404 })
		}
		return NextResponse.json(deleted)
	} catch (error) {
		return NextResponse.json({ error: 'Erreur server lors de la suppression' }, { status: 500 })
	}
}