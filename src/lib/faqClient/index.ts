import { Faq } from '@/types/faq'

export async function getFaqs(): Promise<Faq[]> {
    const res = await fetch('/api/faq')
    return res.json()
}

export async function addFaq(contenu: string, reponse: string, faqId?: number) {
    const res = await fetch('/api/faq/add', {
        method: 'POST',
        body: JSON.stringify({ contenu, reponse, faqId }),
        headers: { 'Content-Type': 'application/json' },
    })
    return res.json()
}

export async function updateFaq(id: number, contenu: string, reponse: string, faqId?: number) {
    const res = await fetch('/api/faq/update', {
        method: 'PUT',
        body: JSON.stringify({ id, contenu, reponse, faqId }),
        headers: { 'Content-Type': 'application/json' },
    })
    return res.json()
}

export async function deleteFaq(id: number) {
    const res = await fetch('/api/faq/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' },
    })
    return res.json()
}