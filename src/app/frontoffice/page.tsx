'use client';

import { Message } from '@/types/allTypes';
import React, { useRef, useState } from 'react';

import Header from '@/components/custom/frontoffice/Header';
import Chatbot, { ChatbotHandle } from "@/components/custom/frontoffice/Chatbot";
import History from "@/components/custom/frontoffice/Historique";
import FAQPage from "@/components/custom/frontoffice/FAQPage";
import ChatInterface from '@/components/custom/frontoffice/ChatInterface';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [newChatroom, setNewChatroom] = useState("");

  // Référence vers le Chatbot pour déclencher startNewSession
  const chatbotRef = useRef<ChatbotHandle>(null);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const startChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi, Comment puis-je t'aider aujourd'hui?",
        sender: "ai",
        timestamp: new Date().toISOString(),
      },
    ])
  }
  const startNewChat = () => {
    chatbotRef.current?.startNewSession(); // Appelle handleNewChat dans FAQPage
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      <div className="w-[60%] max-w-full">
        {/* <Chatbot
          ref={chatbotRef}
          setNewChatroom={setNewChatroom}
          messages={messages}
          setMessages={setMessages}
        /> */}

        <ChatInterface
          ref={chatbotRef}
          setNewChatroom={setNewChatroom}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}