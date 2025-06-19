// app/faqpage.tsx
"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import MessageList from "@/components/front-office/MessageList";
import { Message } from "@/types/message";

// Type pour une question
type Question = {
  id: number;
  contenu: string;
  children?: Question[]; // Utiliser "?" pour indiquer que c'est optionnel
  reponses?: { contenu: string }[];
  
};

export interface FAQPageHandle {
  startNewSession: () => void;
}

interface FAQPageProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  modeLibre: boolean;
  setModeLibre: React.Dispatch<React.SetStateAction<boolean>>;
}

const FAQPage = forwardRef<FAQPageHandle, FAQPageProps>(({
  messages,
  setMessages,
  modeLibre,
  setModeLibre,
}, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [session, setSession] = useState<number>(Date.now());
  const [showInitialQuestions, setShowInitialQuestions] = useState(true);

  // Récupération des questions via l'API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/faq");
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Données reçues du backend :", JSON.stringify(data, null, 2));

        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          throw new Error("Le format des données reçues est incorrect.");
        }
      } catch (err) {
        setError((err as Error).message);
        console.error("Erreur lors de la récupération des questions :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
      console.log("Réinitialisation des messages car nouvelle session");

    setMessages([]);
    setCurrentQuestion(null);
    setModeLibre(false);
    setShowInitialQuestions(true); // 🔄 Réinitialise les questions affichées au démarrage
  }, [session]);

  useEffect(() => {
    if (modeLibre && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.sender === "user") {
        setShowInitialQuestions(false); // 🔒 Cache les questions après saisie libre
      }
    }
  }, [messages, modeLibre]);

  const startNewSession = () => {
    if (messages.length > 0) {
      const historiqueBrut = localStorage.getItem("historique") || "[]";
      const historique = JSON.parse(historiqueBrut);
      const sessionObj = {
        id: Date.now(),
        date: new Date().toISOString(),
        messages: messages,
      };
      historique.push(sessionObj);
      localStorage.setItem("historique", JSON.stringify(historique));
    }
    setSession(Date.now());
  };

  useImperativeHandle(ref, () => ({
    startNewSession,
  }));

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question);

    const botText =
      question.reponses?.[0]?.contenu ||
      "Désolé, aucune réponse disponible pour cette question.";

    const now = new Date().toISOString();

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: question.contenu,
      timestamp: now,
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: botText,
      timestamp: now,
      children: question.children || [],
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);

    // ✅ Active automatiquement le mode libre si plus de sous-questions
    if (!question.children || question.children.length === 0) {
      setModeLibre(true);
    }
  };
 
 const questionsToDisplay = currentQuestion?.children ?? (!currentQuestion ? questions : []);

  const isParentView = !currentQuestion;

  return (
    <div className="flex flex-col bg-white w-full">
      <div className="flex-1">
        <MessageList
          messages={messages}
          onQuestionClick={handleQuestionClick}
        />

        {/* ✅ Affichage conditionnel des questions parent */}
        {isParentView && showInitialQuestions && questionsToDisplay.length > 0 && (
          <div className="flex flex-wrap gap-2 -mt-40 justify-center">
            {questionsToDisplay.map((q) => (
              <button
                key={q.id}
                className="rounded-full border border-solid border-black-300 bg-white px-3 py-3 text-base text-gray-800 hover:bg-gray-200"
                onClick={() => handleQuestionClick(q)}
              >
                {q.contenu}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default FAQPage;
