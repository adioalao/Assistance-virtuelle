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

// Type pour une question
export type Question = {
    id: number;
    content: string;
    orderInChat: number;
    faqGroup: number;
    answer: { content: string }
};


export type Message = {
    id: number;
    sender: "user" | "bot";
    text: string;
    timestamp: string;
    fileUrl?: string;
    fileType?: string;
    /*  children?: {
         id: number;
         content: string;
         answer: { contenu: string };
     }[]; */
};