import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChatbotContext } from '@/contexts/ChatbotContext';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User,
  Minimize2,
  Maximize2,
  HelpCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  ChevronDown
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

const EnhancedChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const {
    currentUser,
    userTasks,
    completedTasksCount,
    totalTasksCount,
    progressPercentage,
    getCurrentPageContext
  } = useChatbotContext();

  // Enhanced responses with context awareness
  const getContextualResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const pageContext = getCurrentPageContext();
    const userName = currentUser?.name || 'there';
    
    // Greeting with personalization
    if (message.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
      if (currentUser) {
        return `Hi ${userName}! Welcome to your onboarding journey. You've completed ${completedTasksCount} out of ${totalTasksCount} tasks (${Math.round(progressPercentage)}% progress). How can I help you today?`;
      }
      return `Hi ${userName}! I'm your onboarding assistant. I'm here to help you navigate your journey. How can I assist you today?`;
    }
    
    // Progress-related questions
    if (message.includes('progress') || message.includes('how am i doing') || message.includes('status')) {
      if (totalTasksCount > 0) {
        const remaining = totalTasksCount - completedTasksCount;
        return `Great question! You're making excellent progress. Here's your current status:\n\n✅ Completed: ${completedTasksCount} tasks\n⏳ Remaining: ${remaining} tasks\n📊 Progress: ${Math.round(progressPercentage)}%\n\n${remaining > 0 ? `You're ${remaining} task${remaining === 1 ? '' : 's'} away from completing your onboarding!` : 'Congratulations! You\'ve completed all your onboarding tasks! 🎉'}`;
      }
      return "I don't see any tasks assigned to you yet. Once you complete your profile, you'll get a personalized checklist to track your progress!";
    }
    
    // Next tasks
    if (message.includes('next') || message.includes('what should i do') || message.includes('priorities')) {
      const pendingTasks = userTasks.filter(task => !task.completed);
      const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
      
      if (highPriorityTasks.length > 0) {
        const nextTask = highPriorityTasks[0];
        return `Your next priority task is: **${nextTask.title}**\n\n${nextTask.description}\n\n⏱️ Estimated time: ${nextTask.estimatedTime} minutes\n🔥 Priority: ${nextTask.priority}\n\nWould you like help with this specific task?`;
      } else if (pendingTasks.length > 0) {
        const nextTask = pendingTasks[0];
        return `Your next task is: **${nextTask.title}**\n\n${nextTask.description}\n\n⏱️ Estimated time: ${nextTask.estimatedTime} minutes\n\nNeed any guidance with this?`;
      }
      return "You're all caught up! 🎉 You've completed all your current tasks. Check back later for any new assignments.";
    }
    
    // Page-specific responses
    if (pageContext === 'dashboard') {
      if (message.includes('task') || message.includes('checklist')) {
        return `You're on your dashboard where you can see all your onboarding tasks. ${totalTasksCount > 0 ? `You have ${totalTasksCount} total tasks with ${completedTasksCount} completed.` : 'Complete your profile to get personalized tasks!'} Need help with any specific task?`;
      }
    }
    
    if (pageContext === 'onboarding') {
      return "You're on the onboarding page! This is where you'll fill out your profile information to get a personalized checklist. Make sure to provide accurate details about your role and department for the best experience.";
    }
    
    // Task-specific help
    if (message.includes('hr') || message.includes('paperwork')) {
      return "For HR paperwork:\n• Complete your tax forms (W-4, state forms)\n• Set up direct deposit\n• Choose your benefits (health, dental, 401k)\n• Update emergency contacts\n• Sign company policies\n\nAll forms are available in your employee portal. Contact HR at hr@company.com if you need help!";
    }
    
    if (message.includes('equipment') || message.includes('laptop') || message.includes('setup')) {
      return "For equipment setup:\n• Your laptop and peripherals should be at your desk\n• Follow the IT setup guide for initial configuration\n• Install required software (list provided by IT)\n• Test VPN and system access\n• Set up your workspace ergonomically\n\nNeed IT support? Contact: it-support@company.com";
    }
    
    if (message.includes('meeting') || message.includes('schedule') || message.includes('calendar')) {
      return "For meetings and scheduling:\n• Your welcome meeting is typically scheduled for day 1\n• Team introductions happen in the first week\n• One-on-ones with your manager are weekly\n• Department meetings info will be shared separately\n\nCheck your calendar for specific times, or ask your manager!";
    }
    
    // Company culture and info
    if (message.includes('culture') || message.includes('values')) {
      return "Our company culture is built on:\n🤝 **Collaboration** - We work together to achieve great things\n💡 **Innovation** - We encourage creative thinking and new ideas\n📚 **Learning** - Continuous growth and development\n⚖️ **Work-Life Balance** - We respect your time and well-being\n🌟 **Excellence** - We strive for quality in everything we do\n\nRead more in the company handbook!";
    }
    
    // Department-specific guidance
    if (currentUser?.department === 'engineering' && message.includes('code')) {
      return "For engineering onboarding:\n• Access to Git repositories (ask your tech lead)\n• Development environment setup\n• Code review process training\n• Architecture documentation\n• Team coding standards\n• First week: shadow a senior developer\n\nYour tech lead will guide you through the technical setup!";
    }
    
    if (currentUser?.department === 'marketing' && (message.includes('brand') || message.includes('marketing'))) {
      return "For marketing onboarding:\n• Brand guidelines and style guide\n• Marketing tools access (analytics, CRM)\n• Campaign templates and processes\n• Content calendar overview\n• Target audience personas\n• Team collaboration tools\n\nYour marketing manager will provide specific training materials!";
    }
    
    // Help and general assistance
    if (message.includes('help') || message.includes('stuck') || message.includes('confused')) {
      return `I'm here to help! Based on your current progress (${Math.round(progressPercentage)}% complete), I can assist with:\n\n• Understanding your next tasks\n• Explaining company processes\n• Connecting you with the right people\n• Troubleshooting common issues\n• Answering policy questions\n\nWhat specific area would you like help with?`;
    }
    
    // Test long response for scrolling
    if (message.includes('test') || message.includes('long') || message.includes('scroll')) {
      return `This is a comprehensive test response to verify that the chatbot can handle long messages properly with scrolling functionality.\n\nHere's a detailed breakdown of our onboarding process:\n\n📋 **Week 1: Getting Started**\n• Complete your profile and personal information\n• Attend the welcome meeting with your manager\n• Set up your workstation and equipment\n• Complete mandatory safety training\n• Get your security badge and access cards\n• Meet your mentor or buddy\n• Review the employee handbook\n• Set up your email and communication tools\n\n💻 **Week 2: Technical Setup**\n• Install required software and applications\n• Get access to necessary databases and systems\n• Complete department-specific training modules\n• Shadow experienced team members\n• Attend team meetings and introductions\n• Start your first small project or task\n• Schedule one-on-ones with your manager\n\n🎯 **Week 3-4: Integration**\n• Take on more substantial responsibilities\n• Complete role-specific certifications\n• Build relationships with cross-functional teams\n• Understand company processes and workflows\n• Provide feedback on your onboarding experience\n• Set goals for your first 90 days\n\n📈 **Ongoing Development**\n• Regular check-ins with your manager\n• Continuous learning opportunities\n• Career development planning\n• Performance reviews and feedback\n• Professional development resources\n\nThis process is designed to help you succeed and feel confident in your new role. Each step builds upon the previous one to ensure a smooth transition into our company culture.\n\nRemember, everyone's onboarding journey is unique, and we're here to support you every step of the way. Don't hesitate to reach out if you have questions or need additional support during this process.`;
    }
    
    // Contacts and escalation
    if (message.includes('contact') || message.includes('who') || message.includes('emergency')) {
      return `Here are your key contacts:\n\n👥 **HR Team**: hr@company.com | ext. 1234\n💻 **IT Support**: it-support@company.com | ext. 5678\n👔 **Your Manager**: Check your welcome email\n🆘 **Emergency**: Call reception ext. 0000\n📞 **General Questions**: Ask me anytime!\n\n${currentUser?.department ? `For ${currentUser.department}-specific questions, I can connect you with your department lead.` : ''}`;
    }
    
    // Default helpful response
    return `I understand you're asking about "${userMessage}". I'm here to help with your onboarding journey! \n\nI can assist with:\n• Task guidance and priorities\n• Company information and policies\n• Technical setup help\n• Connecting you with the right people\n• General workplace questions\n\nCould you be more specific about what you need help with?`;
  };

  // Context-aware suggestions
  const getContextualSuggestions = (): string[] => {
    const pageContext = getCurrentPageContext();
    const baseQuestions = [];
    
    if (totalTasksCount > 0 && completedTasksCount < totalTasksCount) {
      baseQuestions.push("What's my next priority task?");
      baseQuestions.push("How is my progress?");
    }
    
    if (pageContext === 'dashboard') {
      baseQuestions.push("Help me understand my checklist");
      baseQuestions.push("Who should I contact for help?");
    } else if (pageContext === 'onboarding') {
      baseQuestions.push("How do I complete my profile?");
      baseQuestions.push("What happens after onboarding?");
    }
    
    baseQuestions.push("Tell me about company culture");
    baseQuestions.push("What training do I need?");
    
    return baseQuestions.slice(0, 3);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeText = currentUser 
        ? `Hi ${currentUser.name}! I'm your personal onboarding assistant. You're ${Math.round(progressPercentage)}% through your onboarding journey. How can I help you today?`
        : "Welcome! I'm your onboarding assistant. I'm here to help you navigate your journey at the company. How can I assist you today?";
      
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: welcomeText,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: getContextualSuggestions()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentUser, progressPercentage]);

  // Enhanced scroll functions
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        setShowScrollButton(false);
      }
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom && messages.length > 3);
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        // Only auto-scroll if user is near the bottom
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (isNearBottom || messages.length <= 1) {
          setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 50);
        }
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Scroll to bottom after user message
    setTimeout(() => scrollToBottom(), 100);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getContextualResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
        suggestions: userMessage.text.toLowerCase().includes('help') ? getContextualSuggestions() : undefined
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
      
      // Force scroll to bottom after bot response
      setTimeout(() => scrollToBottom(), 200);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        {/* Progress indicator on chatbot button */}
        {totalTasksCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {Math.round(progressPercentage)}%
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-[600px]'} shadow-2xl transition-all duration-300 z-50 flex flex-col overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-500">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold">Onboarding Assistant</CardTitle>
            {currentUser && (
              <p className="text-xs text-blue-100">
                {Math.round(progressPercentage)}% Complete
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-white hover:bg-blue-600"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-blue-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
          <ScrollArea className="flex-1 h-0 chatbot-scroll-area" ref={scrollAreaRef}>
            <div className="p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
                        <AvatarFallback className={message.sender === 'user' ? 'bg-gray-300' : 'bg-blue-100'}>
                          {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-blue-600" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      } break-words chatbot-message`}>
                        <div className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere leading-relaxed">
                          {message.text}
                        </div>
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            {message.suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="cursor-pointer"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                <Badge variant="secondary" className="hover:bg-blue-200 text-xs block">
                                  {suggestion}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="bg-blue-100">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Scroll to bottom button */}
          {showScrollButton && (
            <Button
              onClick={scrollToBottom}
              className="absolute bottom-20 right-4 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-10"
              size="icon"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          )}

          {/* Quick suggestions when conversation starts */}
          {messages.length <= 1 && (
            <div className="p-4 border-t bg-gray-50 flex-shrink-0">
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {getContextualSuggestions().map((suggestion, index) => (
                  <div
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Badge variant="outline" className="hover:bg-blue-50 text-xs justify-start p-2 w-full">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your onboarding..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedChatbot;
