'use client';

import { Message } from '@/types/message';
import React, { useRef, useState } from 'react';

import Header from '@/components/frontoffice/Header';
import Chatbot, { ChatbotHandle } from "@/components/frontoffice/Chatbot";
import History from "@/components/frontoffice/Historique";
import FAQPage from "@/components/frontoffice/FAQPage";

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
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
  }
  const startNewChat = () => {
    chatbotRef.current?.startNewSession(); // Appelle handleNewChat dans FAQPage
  };

  return (
    <div className="h-screen w-full flex flex-col relative transition-all duration-300">
      {/* En-tête */}
      <Header
        onHistoryToggle={toggleHistory}
        onNewChat={startNewChat}
        showHistory={showHistory}
      />

      {/* Contenu principal */}
      <div className="flex flex-1 transition-all duration-300">
        {/* Historique qui se développe */}
        <div
          className={`bg-gray-50 shadow-md h-full overflow-auto transition-all duration-300 ${
            showHistory ? 'w-[20%] p-4' : 'w-0 p-0'
          }`}
        >
          {showHistory && <History newChatroom={newChatroom} messages={messages} setMessages={setMessages}/>}
        </div>

        {/* Contenu du chat (Chatbot) */}
        <div
          className={`flex justify-center items-center transition-all duration-300 ${
            showHistory ? 'w-[80%]' : 'w-full'
          }`}
          id="chatbox"
        >
          <div className="w-[60%]">
            {/* <Chatbot setNewChatroom={setNewChatroom} messages={messages} setMessages={setMessages} /> */}
            <Chatbot
              ref={chatbotRef}
              setNewChatroom={setNewChatroom}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
