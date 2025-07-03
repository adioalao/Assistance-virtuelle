"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Message, Question, ChildQuestion } from "@/types/allTypes";
import MessageList from "@/components/custom/frontoffice/MessageList";
import MessageInput from "@/components/custom/frontoffice/MessageInput";

const ChatPage = () => {
   const params = useParams();
   const id = params?.id;
   const [messages, setMessages] = useState<Message[]>([]);
   const [inputValue, setInputValue] = useState<string>("");
   const [isEmptySession, setIsEmptySession] = useState<boolean>(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   //  Charger la session existante (avec message et potentielle question liée)
   useEffect(() => {
      const fetchSessionAndQuestions = async () => {
         try {
            const res = await fetch(`/api/discussion/${id}`);
            const data = await res.json();

            if (!data.success || !data.session) throw new Error("Session introuvable");

            const messagesData = data.session.messages;

            const messages: Message[] = await Promise.all(
               messagesData.map(async (m: any) => {
                  let children: ChildQuestion[] = [];


                  // Si le message est lié à une question, on la récupère via l'API
                  if (m.questionId) {
                     try {
                        const questionRes = await fetch(`/api/question/${m.questionId}`);
                        if (questionRes.ok) {
                           const fullQuestion: Question = await questionRes.json();
                           children = fullQuestion.children?.map((c) => ({
                              id: c.id,
                              content: c.content,
                           })) ?? [];
                        }
                     } catch (e) {
                        console.warn(`Erreur récupération question ${m.questionId}`, e);
                     }
                  }

                  return {
                     id: m.id,
                     sender: m.authorType === "ai" ? "ai" : "user",
                     text: m.content,
                     timestamp: m.createdAt,
                     children,
                  };
               })
            );

            setMessages(messages);
         } catch (err) {
            console.error("Erreur chargement discussion :", err);
         }
      };

      fetchSessionAndQuestions();
   }, [id]);

   // ✅ Lorsqu'on clique sur une sous-question
   const handleQuestionClick = async (child: ChildQuestion) => {
      try {
         const res = await fetch(`/api/question/${child.id}`);
         if (!res.ok) throw new Error("Erreur lors du chargement de la sous-question");

         const data: Question = await res.json();
         const now = new Date().toISOString();

         const userMessage: Message = {
            id: Date.now(),
            sender: "user",
            text: data.content,
            timestamp: now,
         };

         const aiMessage: Message = {
            id: Date.now() + 1,
            sender: "ai",
            text: data.answer?.content || "Pas de réponse disponible",
            timestamp: now,
            children: data.children?.map((c) => ({
               id: c.id,
               content: c.content,
            })),
         };

         setMessages((prev) => [...prev, userMessage, aiMessage]);
      } catch (error) {
         console.error("Erreur sous-question:", error);
      }
   };

   const handleSendMessage = (userText: string) => {
      if (!userText.trim()) return;

      const now = new Date().toISOString();
      const newMessages: Message[] = [
         {
            id: Date.now(),
            sender: "user",
            text: userText,
            timestamp: now,
         },
         {
            id: Date.now() + 1,
            sender: "ai",
            text: "Réponse simulée par l'IA.",
            timestamp: now,
         },
      ];

      setMessages((prev) => [...prev, ...newMessages]);
      setInputValue("");
   };

   return (
      <div className="h-screen md:h-[89vh] flex flex-col w-full max-w-full overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-56">
         <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} onQuestionClick={handleQuestionClick} />
         </div>

         <div className="px-2 sm:px-4 pb-2">
            <MessageInput
               inputValue={inputValue}
               setInputValue={setInputValue}
               handleSendMessage={() => handleSendMessage(inputValue)}
               textareaRef={textareaRef}
               onSend={handleSendMessage}
               onFileUpload={(fileUrl, fileType) => {
                  const now = new Date().toISOString();
                  const userMessage: Message = {
                     id: Date.now(),
                     sender: "user",
                     text: "Fichier envoyé",
                     fileUrl,
                     fileType,
                     timestamp: now,
                  };
                  setMessages((prev) => [...prev, userMessage]);
               }}
            />
         </div>
      </div>
   );
};

export default ChatPage;