/*
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
*/
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
   const [inputValue, setInputValue] = useState<string>("");
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   // ✅ Récupère la session + questions si liées
   useEffect(() => {
      const fetchSessionAndQuestions = async () => {
         try {
            const res = await fetch(`/api/discussion/${id}`);
            const data = await res.json();
            console.log(data);


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
                        console.error(`Erreur récupération de la question liée (ID: ${m.questionId})`, e);
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

   // ✅ Envoi de message
   const handleSendMessage = (userText: string) => {
      if (!userText.trim()) return;

      const now = new Date().toISOString();
      const userMessage: Message = {
         id: Date.now(),
         sender: "user",
         text: userText,
         timestamp: now,
      };

      const aiMessage: Message = {
         id: Date.now() + 1,
         sender: "ai",
         text: "Réponse simulée par l'IA.",
         timestamp: now,
      };

      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setInputValue("");
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

               </div>
            </div>
         </div>
      </div>
   );
};

export default ChatPage;

{/* <div className="flex-1 flex flex-col w-full h-screen ">
         <div className="flex flex-col overflow-auto">
            <MessageList messages={messages} onQuestionClick={handleQuestionClick} />
         </div>
         <div className="border-t bg-white px-2 sm:px-4 py-3 sticky bottom-0 z-10">
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

      </div> */}