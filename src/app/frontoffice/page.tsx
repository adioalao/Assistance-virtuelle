'use client';

import ChatInterface from '@/components/custom/frontoffice/ChatInterface';

export default function Home() {

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      <div className="w-[60%] max-w-full">
        <ChatInterface />
      </div>
    </div>
  );
}