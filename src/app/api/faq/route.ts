import { NextResponse } from 'next/server'
import { faqService } from '@/lib/services/faqService'

export async function GET() {
  const faqs = await faqService.getAll()
  return NextResponse.json(faqs)
}
