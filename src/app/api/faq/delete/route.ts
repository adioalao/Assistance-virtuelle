import { NextRequest, NextResponse } from 'next/server'
import { faqService } from '@/lib/services/faqService'

export async function DELETE(req: NextRequest) {
    const { id } = await req.json()
    const deleted = await faqService.deleteFaq(id)
    return NextResponse.json(deleted)
}