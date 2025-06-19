export type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  fileUrl?: string;     
  fileType?: string;  
  children?: {
    id: number;
    contenu: string;
    reponses?: { contenu: string }[];
    children?: any[]; // pour permettre récursion
  }[];
};
