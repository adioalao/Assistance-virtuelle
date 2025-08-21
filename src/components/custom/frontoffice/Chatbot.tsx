"use client";

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Message } from "@/types/allTypes";
import WelcomeMessage from "./WelcomMessage";
import MessageInput from "./MessageInput";
import FAQPage, { FAQPageHandle } from "./FAQPage";

export interface ChatbotHandle {
  startNewSession: () => void;
}

const Chatbot = forwardRef<ChatbotHandle>((props, ref) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [modeLibre, setModeLibre] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const faqPageRef = useRef<FAQPageHandle>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

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

    setMessages((prev) => [...prev, ...newMessages]);
    setInputValue("");
  };

  useImperativeHandle(ref, () => ({
    startNewSession: () => {
      faqPageRef.current?.startNewSession();
    },
  }));

  return (
    <div className="h-[89vh] flex flex-col bg-white w-full">
      {messages.length === 0 && (
        <div className="p-0 mt-40">
          <WelcomeMessage text="Bienvenue ! Comment puis-je vous aider ?" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <FAQPage
          ref={faqPageRef}
          messages={messages}
          setMessages={setMessages}
          modeLibre={modeLibre}
          setModeLibre={setModeLibre}
        />
      </div>

      <div>
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
});

export default Chatbot;
