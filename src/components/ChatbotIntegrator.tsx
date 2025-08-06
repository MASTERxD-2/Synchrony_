import React, { useEffect } from 'react';
import { useChatbotContext } from '@/contexts/ChatbotContext';
import { User, ChecklistItem } from '@/types/User';

interface ChatbotIntegratorProps {
  user?: User;
  tasks?: ChecklistItem[];
  children: React.ReactNode;
}

/**
 * This component integrates with the chatbot context to provide user data.
 * Wrap it around components that have user and task data to automatically
 * sync with the chatbot.
 */
const ChatbotIntegrator: React.FC<ChatbotIntegratorProps> = ({ 
  user, 
  tasks = [], 
  children 
}) => {
  const { setCurrentUser, setUserTasks } = useChatbotContext();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user, setCurrentUser]);

  useEffect(() => {
    if (tasks.length > 0) {
      setUserTasks(tasks);
    }
  }, [tasks, setUserTasks]);

  return <>{children}</>;
};

export default ChatbotIntegrator;
