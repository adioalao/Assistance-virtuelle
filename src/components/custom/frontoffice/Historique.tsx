'use client';
import React, { useEffect, useState } from "react";
import { format, isToday, isYesterday, subDays, isWithinInterval } from "date-fns";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  content: string;
  senderId: number | string;
  createdAt: string;
}

interface ChatroomType {
  id: number;
  titre: string;
}

interface HistoryProps {
  newChatroom: ChatroomType;
  setMessages: (messages: {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    createdAt: string;
  }[]) => void;
}

const History: React.FC<HistoryProps> = ({ newChatroom, setMessages }) => {
  const [chatrooms, setChatRooms] = useState<ChatroomType[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const { data: session } = useSession();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setChatRooms(data.chatroom || []);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique', error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (newChatroom?.id) {
      setChatRooms((prev) => [newChatroom, ...prev]);
    }
  }, [newChatroom]);

  const fetchMessages = async (chatroomId: number) => {
    if (!session?.user?.id) {
      console.error("Utilisateur non connecté");
      return;
    }

    try {
      const res = await fetch(`/api/history/${chatroomId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const formattedMessages = data?.chatroomWithMessage?.message?.map((message: Message) => ({
        id: message.id,
        text: message.content,
        sender: message.senderId === session.user.id ? "user" : "bot",
        createdAt: message.createdAt
      })) || [];
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages", error);
    }
  };

  const handleTitleClick = (chatroom: ChatroomType) => {
    setTitle(chatroom.titre);
    setSelectedChatRoom(chatroom.id);
    fetchMessages(chatroom.id);
  };

  return (
    <div className="p-7 overflow-y-auto mt-[30px]">
      <h2 className="text-lg font-bold mb-3">Vos conversations</h2>
      {chatrooms.map((item) => (
        <h1
          key={item.id}
          onClick={() => handleTitleClick(item)}
          role="button"
          className={`
            cursor-pointer my-1.5 px-3 py-2 rounded-md transition-all
            hover:bg-gray-100 focus:outline-none focus:ring-2
            focus:ring-gray-300 border-none
            ${selectedChatRoom === item.id ? "bg-gray-100 font-medium" : "font-normal"}
          `}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleTitleClick(item)}
        >
          {item.titre}
        </h1>
      ))}
    </div>
  );
};

export default History;
