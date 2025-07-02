import React from "react";

interface Question {
  id: number;
  content: string;
  children: {
    id: number;
    content: string;
    reponses?: { content: string }[];
  }[];
}

interface QuestionCardProps {
  question: Question;
  onQuestionClick: (childQuestion: {
    id: number;
    content: string;
    reponses?: { content: string }[];
  }) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onQuestionClick }) => {
  return (
    <div className="flex p-2 w-80 border border-gray-200 rounded-md shadow-sm">
      <h2 className="text-lg items-center font-semibold mb-2">{question.content}</h2>
      <div className="space-x-2">
        {question.children.map((child) => (
          <button
            key={child.id}
            className="items-center rounded-md bg-green-100 m-1 px-2 py-1 text-sm font-semibold text-green-800 hover:bg-green-200"
            onClick={() => onQuestionClick(child)}
          >
            {child.content}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
