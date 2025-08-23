import React from "react";

interface WelcomeMessageProps {
  text: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ text }) => (
  <div className="text-center flex flex-col items-center">
    <h2 className="text-2xl text-gray-500 font-medium mb-0">{text}</h2>
  </div>
);

export default WelcomeMessage;
