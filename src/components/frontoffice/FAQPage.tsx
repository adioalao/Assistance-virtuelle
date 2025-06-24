"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import MessageList from "@/components/frontoffice/MessageList";
import { Message } from "@/types/message";

type Question = {
  id: number;
  contenu: string;
  children?: Question[];
  reponse?: { contenu: string } | null;
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

const FAQPage = forwardRef<FAQPageHandle, FAQPageProps>(
  ({ messages, setMessages, modeLibre, setModeLibre }, ref) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
      null
    );
    const [session, setSession] = useState<number>(Date.now());
    const [showInitialQuestions, setShowInitialQuestions] = useState(true);

    useEffect(() => {
      const fetchQuestions = async () => {
        try {
          const res = await fetch("/api/faq");
          if (!res.ok) {
            throw new Error(`Erreur ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();
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
      setMessages([]);
      setCurrentQuestion(null);
      setModeLibre(false);
      setShowInitialQuestions(true); // ✅ Réaffiche les questions au redémarrage
    }, [session]);

    useEffect(() => {
      if (modeLibre && messages.length > 0) {
        const last = messages[messages.length - 1];
        if (last.sender === "user") {
          setShowInitialQuestions(false);
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
      setShowInitialQuestions(false); // ✅ Masque les suggestions

      const botText =
        question.reponse?.contenu ||
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

      // ✅ Passe en mode libre si la question n'a pas d'enfants
      if (!question.children || question.children.length === 0) {
        setModeLibre(true);
      }
    };

    const questionsToDisplay =
      currentQuestion?.children ?? (!currentQuestion ? questions : []);
    const isParentView = !currentQuestion;

    return (
      <div className="flex flex-col bg-white w-full">
        <div className="flex-1">
          <MessageList
            messages={messages}
            onQuestionClick={handleQuestionClick}
          />

          {/* ✅ Affichage conditionnel des suggestions de départ */}
          {isParentView &&
            showInitialQuestions &&
            questionsToDisplay.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center px-4 py-2">
                {questionsToDisplay.map((q) => (
                  <button
                    key={q.id}
                    className="rounded-full border border-solid border-gray-300 bg-white px-4 py-2 text-gray-800 hover:bg-gray-200 text-xl"
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
  }
);

export default FAQPage;