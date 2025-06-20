'use client'

import React from "react";
import { Message } from '@/types/message'

interface MessageListProps {
  messages: Message[];
  onQuestionClick: (question: any) => void; // nouvelle prop
}


const MessageList: React.FC<MessageListProps> = ({ messages, onQuestionClick }) => (
  <div className="w-full mx-auto flex flex-col flex-1 overflow-hidden pt-15 pb-18">
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4 ">
        {messages.map((message) =>
          message.sender === "bot" ? (
            <div key={message.id} className="flex flex-col items-start space-x-3">
              <div className="flex items-center space-x-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500">
                  <span className="text-xs font-bold text-white">AI</span>
                </span>
                <div className="rounded-lg bg-white px-4 py-3 text-sm text-gray-900 shadow">
                  {message.text}

                   {/* Affichage des enfants si présents */}
              {Array.isArray(message.children) && message.children.length > 0 && (
  <div className="mt-2 flex flex-col gap-2">
    {message.children.map((child, index) => {
      if (!child || typeof child.id === "undefined" || !child.contenu) return null;
      return (
        <button
          key={child.id}
          className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-200"
          onClick={() => onQuestionClick(child)}
        >
          {child.contenu}
        </button>
      );
    })}
  </div>
)}

                </div>
              </div>

             
            </div>
          ) : (
            <div key={message.id} className="flex items-start justify-end space-x-3">
              <div className="max-w-84 rounded-lg bg-gray-100 px-4 py-3 text-sm text-black shadow">
                {message.text}
              </div>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <span className="text-xs font-bold text-gray-900">U</span>
              </span>
            </div>
          )
        )}
      </div>
    </div>
  </div>
);

export default MessageList;
