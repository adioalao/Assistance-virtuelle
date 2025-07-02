
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Message, Question, ChildQuestion } from "@/types/allTypes";
import MessageList from "@/components/custom/frontoffice/MessageList";
import MessageInput from "@/components/custom/frontoffice/MessageInput";

const ChatPage = () => {
   const params = useParams() as Record<string, string | undefined>;
   const id = params?.id;
   const [question, setQuestion] = useState<Question | null>(null);
   const [messages, setMessages] = useState<Message[]>([]);
   const [inputValue, setInputValue] = useState<string>("");
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   console.log(id);

   useEffect(() => {
      const fetchQuestion = async () => {
         try {
            const res = await fetch(`/api/question/${id}`);
            if (!res.ok) throw new Error("Erreur lors du chargement de la question");
            const data: Question = await res.json();
            setQuestion(data);

            const now = new Date().toISOString();
            const initialMessages: Message[] = [
               {
                  id: Date.now(),
                  sender: "user",
                  text: data.content,
                  timestamp: now,
               },
               {
                  id: Date.now() + 1,
                  sender: "bot",
                  text: data.answer?.content || "Pas de réponse disponible pour cette question.",
                  timestamp: now,
                  children: data.children?.map((child) => ({
                     id: child.id,
                     content: child.content,
                  })),
               },
            ];
            setMessages(initialMessages);
         } catch (err) {
            console.error("Erreur fetch question:", err);
         }
      };
      fetchQuestion();
   }, [id]);

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
            sender: "bot",
            text: "Voici une réponse simulée par l'IA.",
            timestamp: now,
         },
      ];

      setMessages((prev) => [...prev, ...newMessages]);
      setInputValue("");
   };

   const handleQuestionClick = async (child: ChildQuestion) => {
      try {
         const res = await fetch(`/api/question/${child.id}`);
         if (!res.ok) throw new Error("Erreur fetch sous-question");

         const fullQuestion: Question = await res.json();
         const now = new Date().toISOString();

         const userMessage: Message = {
            id: Date.now(),
            sender: "user",
            text: fullQuestion.content,
            timestamp: now,
         };

         const botMessage: Message = {
            id: Date.now() + 1,
            sender: "bot",
            text: fullQuestion.answer?.content || "Pas de réponse disponible",
            timestamp: now,
            children: fullQuestion.children?.map((c) => ({ id: c.id, content: c.content })),
         };

         setMessages((prev) => [...prev, userMessage, botMessage]);
      } catch (err) {
         console.error("Erreur sous-question:", err);
      }
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