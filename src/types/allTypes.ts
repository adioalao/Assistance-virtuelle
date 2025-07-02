// ✅ Statut possible d'une question
export enum QuestionStatus {
    provisional = "provisional",
    approved = "approved",
    rejected = "rejected",
}

// ✅ Type d'une réponse associée à une question
export type Answer = {
    content: string;
};

// ✅ Type d'une question avec potentiellement des sous-questions
export type Question = {
    id: number;
    content: string;
    answer: Answer;
    order: number;
    children?: Question[];
    faqTitle?: string; // si la question est la première d'une FAQ
};

// ✅ Type de FAQ (utilisé si besoin pour gérer les groupes FAQ)
export type Faq = {
    id: number;
    title: string;
    createdAt: string;
    updatedAt: string;
    questions?: Question[];
};
export type ChildQuestion = {
    id: number;
    content: string;
};

// ✅ Type pour un message dans l'interface
export type Message = {
    id: number;
    sender: "user" | "bot";
    text: string;
    timestamp: string;
    fileUrl?: string;
    fileType?: string;
    children?: ChildQuestion[];
};