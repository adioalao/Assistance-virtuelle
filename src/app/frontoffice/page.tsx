'use client';

import { Message } from '@/types/allTypes';
import React, { useRef, useState } from 'react';
import { ChatbotHandle } from "@/components/custom/frontoffice/Chatbot";
import ChatInterface from '@/components/custom/frontoffice/ChatInterface';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newChatroom, setNewChatroom] = useState("");

  // Référence vers le Chatbot pour déclencher startNewSession
  const chatbotRef = useRef<ChatbotHandle>(null);

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      <div className="w-[60%] max-w-full">
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