import React, { createContext, useContext, useState } from 'react';

const AIChatContext = createContext();

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};

export const AIChatProvider = ({ children }) => {
  const [isAIChatModalOpen, setIsAIChatModalOpen] = useState(false);

  return (
    <AIChatContext.Provider value={{
      isAIChatModalOpen,
      setIsAIChatModalOpen
    }}>
      {children}
    </AIChatContext.Provider>
  );
};
