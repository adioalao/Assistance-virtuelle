import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/lib/services/faqService'

export async function POST(req: NextRequest) {
    const { contenu, reponse, faqId } = await req.json()
    const faq = await faqService.addFaq(contenu, reponse, faqId)
    return NextResponse.json(faq)
}