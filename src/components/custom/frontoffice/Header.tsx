// components/Header.tsx

import React from "react";
import Image from "next/image"
import { SquarePen } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import Img from "./logo.webp"; // Assure-toi que le chemin d'image est correct
import LogoutButton from "./LogoutButton";
interface HeaderProps {
  onHistoryToggle: () => void;
  onNewChat: () => void;
  showHistory: boolean;
}

const Header: React.FC<HeaderProps> = ({ onHistoryToggle, onNewChat, showHistory }) => {
  return (
    <header className="fixed w-full h-12 bg-white shadow-md flex items-center px-4">
      {/* Icône historique */}
      <button
        onClick={onHistoryToggle}
        className="px-2 py-2 bg-gray-100  rounded-sm hover:bg-gray-200 transition"
      >

        <DynamicIcon name="panel-right" size={23} />
      </button>

      {/* Logo du chatbot */}
      <div className={`flex items-center transition-all duration-300 ${showHistory ? "ml-[8%]" : "ml-5"}`}>
        <div className="h-40 w-40 relative">
          <Image
            src={Img}
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

      </div>

      {/* Bouton New Chat */}
      <div className="flex space-x-2 ml-auto pr-5">
        <button
          onClick={onNewChat}
          className="inline-flex items-center rounded-sm bg-gray-100 px-2 py-2   hover:bg-gray-200"
        >
          <SquarePen size={23} />
        </button>
      </div>
      <div>
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
