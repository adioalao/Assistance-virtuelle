"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Message, Question, ChildQuestion } from "@/types/allTypes";
import MessageList from "@/components/custom/frontoffice/MessageList";
import MessageInput from "@/components/custom/frontoffice/MessageInput";

const ChatPage = () => {
   const params = useParams();
   const id = Number(params?.id);
   const [messages, setMessages] = useState<Message[]>([]);

   // ✅ Récupère la session + questions si liées
   useEffect(() => {
      const fetchSessionAndQuestions = async () => {
         try {
            const res = await fetch(`/api/discussion/${id}`);

            if (!res.ok) {
               throw new Error("Erreur lors de l'appel de api/discussion/id");
            }
            const data = await res.json();
            if (!data.success || !data.session) throw new Error("Session introuvable");

            const messagesData = data.session.messages;

            const mappedMessages: Message[] = await Promise.all(
               messagesData.map(async (m: any) => {
                  let children: ChildQuestion[] = [];

                  // Récupération des enfants si question liée
                  if (m.questionId) {
                     try {
                        const qRes = await fetch(`/api/question/${m.questionId}`);
                        if (qRes.ok) {
                           const fullQuestion: Question = await qRes.json();
                           children = fullQuestion.children?.map((c) => ({
                              id: c.id,
                              content: c.content,
                           })) ?? [];
                        }
                     } catch (e) {
                        console.log(`Erreur récupération de la question liée (ID: ${m.questionId})`, e);
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
            console.log('mapped : ', mappedMessages);

            setMessages(mappedMessages);
         } catch (err) {
            console.error("Erreur chargement discussion :", err);
         }
      };

      if (id) fetchSessionAndQuestions();
   }, [id]);

   // ✅ Gestion des sous-questions cliquées
   const handleQuestionClick = async (child: ChildQuestion) => {
      try {
         const res = await fetch(`/api/question/${child.id}`);
         if (!res.ok) throw new Error("Erreur sous-question");

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
            text: data.answer?.content || "Pas de réponse disponible.",
            timestamp: now,
            children: data.children?.map((c) => ({
               id: c.id,
               content: c.content,
            })),
         };
         setMessages((prev) => [...prev, userMessage, aiMessage]);
      } catch (err) {
         console.error("Erreur sous-question:", err);
      }
   };

   return (
      <div className="flex h-[90vh] w-full overflow-hidden">
         <div className="flex flex-col flex-1">
            {/* 🧠 Zone principale centrée */}
            <div className="flex-1 flex flex-col items-center overflow-hidden">
               <div className="w-full max-w-4xl flex flex-col flex-1 overflow-hidden relative">

                  {/* Zone scrollable des messages */}
                  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[100px]">
                     <MessageList
                        messages={messages}
                        onQuestionClick={handleQuestionClick}
                     />
                  </div>

                  {/* 🧷 Input FIXE en bas */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center z-20">
                     <div className="w-full max-w-4xl px-4 py-2 bg-white">
                        <MessageInput />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChatPage;