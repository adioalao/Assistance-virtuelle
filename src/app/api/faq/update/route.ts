import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/lib/services/faqService'

export async function PUT(req: NextRequest) {
    const { id, contenu, reponse, faqId } = await req.json()
    const updated = await faqService.updateFaq(id, contenu, reponse, faqId)
    return NextResponse.json(updated)
}