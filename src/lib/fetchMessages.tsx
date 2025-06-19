// lib/fetchMessages.ts
import {Message} from '@/types/message'

export async function fetchMessages(): Promise<Message[]> {
    try {
        const res = await fetch('http://localhost:4000/messages')
        if (!res.ok) {
            throw new Error('Erreur lors du chargement des messages mock')
        }
        return res.json()
    } catch (error) {
        console.error('Erreur lors de la récupération des données du bot:', error);
        return [];
    }
}
