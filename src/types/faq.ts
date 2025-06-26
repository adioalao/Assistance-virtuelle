/* export type Faq = {
    id: number
    contenu: string
    reponse: { contenu: string }
    createdAt: string
    faq?: { titre: string }
} */
export enum QuestionStatus {
    provisional,
    approved,
    rejected
}