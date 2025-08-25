"use client";

import React from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import FileUploader from "./FileUploader";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSend: (message: string) => void;
  onFileUpload?: (url: string, type: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  textareaRef,
  onSend,
  onFileUpload,
}) => {

  console.log('render tes =');
  return (
    <div className="my-2 pr-2 flex items-center gap-2 border-solid border-gray-200 border rounded-sm bg-white">
      {/* Zone de texte */}
      <textarea
        ref={textareaRef}
        rows={2}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        className="flex-grow resize-none bg-transparent text-lg focus:outline-none placeholder-gray-500 py-2 text-gray-900"
        placeholder="Écrivez votre message ici..."
        style={{
          maxHeight: "160px",
          overflowY: inputValue ? "auto" : "hidden",
        }}
      />

      {/* 📎 Bouton pour fichier */}
      {onFileUpload && <FileUploader onFileUpload={onFileUpload} />}

      {/* Bouton envoyer */}
      <Button
        onClick={handleSendMessage}
        // className="p-2 rounded-full inline-flex items-center text-sm font-semibold bg-gray-500 hover:bg-gray-300 text-white"
        title="Envoyer"
      >
        <PaperAirplaneIcon className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MessageInput;
