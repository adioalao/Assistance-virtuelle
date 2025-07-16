"use client";

import React from "react";
import { Message, ChildQuestion } from "@/types/allTypes";

interface MessageListProps {
  messages: Message[];
  onQuestionClick: (question: ChildQuestion) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onQuestionClick }) => {
  return (
    <div className="w-full mx-auto flex flex-col flex-1 pt-2 pb-14">
      <div className="flex-1 px-2 sm:px-4 py-4 space-y-4">

        {/* ✅ Affichage si la discussion est vide */}
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10 text-sm sm:text-base">
            Cette discussion est vide. Commencez à écrire un message pour lancer la conversation.
          </div>
        ) : (
          messages.map((message) =>
            message.sender === "ai" ? (

              <div key={message.id} className="flex flex-col items-start space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-white px-4 py-3 text-[15px] text-gray-900 shadow max-w-sm sm:max-w-md md:max-w-lg">
                    {message.text}

                    {/* ✅ Sous-questions cliquables */}
                    {Array.isArray(message.children) && message.children.length > 0 && (
                      <div className="my-3 flex flex-col gap-2">
                        {message.children.map((child) => (
                          <button
                            key={child.id}
                            className="rounded-md bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                            onClick={() => onQuestionClick(child)}
                          >
                            {child.content}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex items-start justify-end space-x-3">
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-[15px] text-black shadow max-w-sm sm:max-w-md md:max-w-lg">
                  {message.text}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default MessageList;