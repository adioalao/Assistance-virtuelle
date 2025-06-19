import React, { useState } from 'react';

const ChatInterface = () => {
  const [faqTerminee, setFaqTerminee] = useState(false);

  const terminerFaq = () => {
    setFaqTerminee(true);
  };

  return (
    <div className="p-6">
      {!faqTerminee && (
        <div>
          {/* Bouton pour terminer la FAQ */}
          
         
          
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
