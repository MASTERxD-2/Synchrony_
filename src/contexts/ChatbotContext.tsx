import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ChecklistItem } from '@/types/User';

interface ChatbotContextType {
  currentUser: User | null;
  userTasks: ChecklistItem[];
  completedTasksCount: number;
  totalTasksCount: number;
  progressPercentage: number;
  setCurrentUser: (user: User | null) => void;
  setUserTasks: (tasks: ChecklistItem[]) => void;
  getCurrentPageContext: () => string;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: React.ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTasks, setUserTasks] = useState<ChecklistItem[]>([]);

  const completedTasksCount = userTasks.filter(task => task.completed).length;
  const totalTasksCount = userTasks.length;
  const progressPercentage = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;

  const getCurrentPageContext = (): string => {
    const currentPath = window.location.pathname;
    
    switch (currentPath) {
      case '/dashboard':
        return 'dashboard';
      case '/onboarding':
      case '/onboardingpage':
        return 'onboarding';
      case '/preboarding':
        return 'preboarding';
      case '/admin':
        return 'admin';
      case '/login':
        return 'login';
      case '/registration':
        return 'registration';
      default:
        return 'general';
    }
  };

  const value: ChatbotContextType = {
    currentUser,
    userTasks,
    completedTasksCount,
    totalTasksCount,
    progressPercentage,
    setCurrentUser,
    setUserTasks,
    getCurrentPageContext,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
