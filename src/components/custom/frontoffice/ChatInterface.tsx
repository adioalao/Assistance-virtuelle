/*
 C'est le composant charger de l'affichage du contenu de la page de suggestion des faqs
*/
"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Message, Question } from "@/types/allTypes";
import WelcomeMessage from "./WelcomMessage";
import MessageInput from "./MessageInput";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/error-handler";
import { useSidebarData } from "./SidebarDataContext";

function ChatInterface() {
  const [inputValue, setInputValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null) as React.RefObject<HTMLTextAreaElement>;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Récupération des méthodes du contexte sidebar
  const { addSession } = useSidebarData();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/faq/first-questions");
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
        console.error("Erreur lors de la récupération des questions :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;
    console.log(userText);

    const now = new Date().toISOString();

    const newMessages: Message[] = [
      {
        id: Date.now(),
        sender: "user",
        text: userText.trim(),
        timestamp: now,
      },
      {
        id: Date.now() + 1,
        sender: "ai",
        text: "Voici la réponse générée par l'IA (simulée ici).",
        timestamp: now,
      },
    ];

    setInputValue("");
  };

  const handleClick = async (question: Question) => {
    setLoading(true);

    try {
      // Étape 1 — Vérifie si une session existe déjà
      const checkRes = await fetch("/api/discussion/find-existing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: question.id })
      });

      const checkData = await checkRes.json();

      if (checkData.exists && checkData.sessionId) {
        // ✅ Redirection vers l'existante
        router.push(`/frontoffice/chat/${checkData.sessionId}`);
        return;
      }

      // Étape 2 — Crée une nouvelle discussion
      const res = await fetch("/api/discussion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: question.content,
          messages: [
            {
              content: question.content,
              authorType: "user",
              questionId: question.id,
            },
            {
              content: question.answer?.content ?? "Aucune réponse disponible",
              authorType: "ai",
              questionId: question.id,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Échec de la création");

      // ✅ Ajout immédiat à la sidebar sans attendre le rechargement
      addSession({
        id: data.sessionId,
        title: question.content.slice(0, 25) || "(Sans titre)",
        url: `/frontoffice/chat/${data.sessionId}`
      });

      router.push(`/frontoffice/chat/${data.sessionId}`);
    } catch (error) {
      console.log(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[89vh] flex flex-col bg-white w-full max-w-full overflow-hidden">
      {/* Header avec message de bienvenue */}
      <div className="p-4 md:p-0 md:mt-40">
        <WelcomeMessage text="Bienvenue ! Comment puis-je vous aider ?" />
      </div>

      {/* Zone de contenu principale avec questions */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mt-4 md:mt-20 justify-center">
            {questions.map((q) => (
              <button
                key={q.id}
                disabled={loading}
                className="rounded-sm border border-solid border-gray-300 bg-white px-3 py-3 text-sm md:text-base text-gray-800 hover:bg-gray-200 w-full sm:w-auto disabled:opacity-50"
                onClick={() => handleClick(q)}
              >
                {q.content}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center z-20">
        <div className="w-full max-w-4xl px-4 py-2 bg-white">
          <MessageInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSendMessage={() => handleSendMessage(inputValue)}
            textareaRef={textareaRef}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
