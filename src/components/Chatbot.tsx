import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  Users
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  userRole?: string;
  userDepartment?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ userRole = 'intern', userDepartment = 'engineering' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Predefined responses based on common onboarding questions
  const responses = {
    greeting: [
      "Hi there! I'm your onboarding assistant. I'm here to help you navigate your first days at the company. How can I assist you today?",
      "Welcome! I'm here to help with any questions about your onboarding process. What would you like to know?",
      "Hello! Ready to make your onboarding journey smooth? Ask me anything!"
    ],
    help: [
      "I can help you with:\n• Onboarding task guidance\n• Company policies and procedures\n• Finding resources and contacts\n• Technical setup assistance\n• General workplace questions\n\nWhat specific area would you like help with?"
    ],
    tasks: {
      general: "Your onboarding tasks are designed to get you up to speed quickly. You can find your personalized checklist on the dashboard. Need help with a specific task?",
      hr: "For HR paperwork, you'll need to complete your tax forms, emergency contacts, and benefit selections. All forms are available in your employee portal.",
      setup: "For account setup, start with your email and Slack. IT will provide credentials. Need help with specific software?",
      training: "Safety training is mandatory and includes workplace safety videos and emergency procedures. Complete this within your first week."
    },
    company: {
      handbook: "The company handbook covers our mission, values, policies, and culture. It's available in your dashboard under 'Resources'. Take time to read through it!",
      culture: "Our company values collaboration, innovation, and continuous learning. We encourage open communication and support work-life balance.",
      benefits: "Employee benefits include health insurance, retirement plans, PTO, and professional development opportunities. HR can provide detailed information."
    },
    technical: {
      general: "For technical setup, you'll receive your equipment and access credentials from IT. Follow the setup checklist in your onboarding tasks.",
      software: "Common software includes Slack for communication, project management tools, and development environments specific to your role.",
      access: "If you're missing access to any systems, contact IT support or your manager. Most access is provisioned within 24-48 hours."
    },
    contacts: {
      hr: "HR Contact: hr@company.com or ext. 1234",
      it: "IT Support: it-support@company.com or ext. 5678",
      manager: "Your direct manager's contact info is in your welcome email. Don't hesitate to reach out!",
      mentor: "If you're assigned a mentor, their contact info will be provided separately. Great resource for questions!"
    }
  };

  const quickSuggestions = [
    "What are my first day tasks?",
    "How do I access company systems?",
    "Who should I contact for help?",
    "Tell me about company culture",
    "What training do I need to complete?",
    "Where can I find the employee handbook?"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: responses.greeting[Math.floor(Math.random() * responses.greeting.length)],
        sender: 'bot',
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(0, 3)
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Greeting patterns
    if (message.match(/^(hi|hello|hey|good morning|good afternoon)/)) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    // Help patterns
    if (message.includes('help') || message.includes('assist')) {
      return responses.help[0];
    }
    
    // Task-related questions
    if (message.includes('task') || message.includes('checklist') || message.includes('first day')) {
      if (message.includes('hr') || message.includes('paperwork')) {
        return responses.tasks.hr;
      } else if (message.includes('setup') || message.includes('account') || message.includes('access')) {
        return responses.tasks.setup;
      } else if (message.includes('training') || message.includes('safety')) {
        return responses.tasks.training;
      }
      return responses.tasks.general;
    }
    
    // Company information
    if (message.includes('handbook') || message.includes('policy')) {
      return responses.company.handbook;
    }
    if (message.includes('culture') || message.includes('values')) {
      return responses.company.culture;
    }
    if (message.includes('benefit') || message.includes('insurance')) {
      return responses.company.benefits;
    }
    
    // Technical questions
    if (message.includes('software') || message.includes('tool') || message.includes('system')) {
      if (message.includes('access') || message.includes('login')) {
        return responses.technical.access;
      } else if (message.includes('install') || message.includes('download')) {
        return responses.technical.software;
      }
      return responses.technical.general;
    }
    
    // Contact information
    if (message.includes('contact') || message.includes('who') || message.includes('reach')) {
      if (message.includes('hr')) return responses.contacts.hr;
      if (message.includes('it') || message.includes('technical')) return responses.contacts.it;
      if (message.includes('manager')) return responses.contacts.manager;
      if (message.includes('mentor')) return responses.contacts.mentor;
      return "Here are key contacts:\n• HR: hr@company.com\n• IT Support: it-support@company.com\n• Your Manager: Check your welcome email\n• Reception: ext. 0000";
    }
    
    // Department-specific responses
    if (userDepartment === 'engineering' && message.includes('code')) {
      return "For engineering onboarding, you'll get access to our repositories, development environments, and coding standards. Check with your tech lead for specific setup instructions.";
    }
    
    // Default response
    return "I'd be happy to help! I can assist with onboarding tasks, company information, technical setup, and connecting you with the right people. Could you be more specific about what you need help with?";
  };

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

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
        suggestions: userMessage.text.toLowerCase().includes('help') ? quickSuggestions.slice(0, 3) : undefined
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
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
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed ${isMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-[600px]'} shadow-2xl transition-all duration-300 z-50 flex flex-col`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-500">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">Onboarding Assistant</CardTitle>
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
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className={message.sender === 'user' ? 'bg-gray-300' : 'bg-blue-100'}>
                        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-blue-600" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="cursor-pointer"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <Badge variant="secondary" className="hover:bg-blue-200 text-xs">
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
                    <Avatar className="h-8 w-8">
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
          </ScrollArea>

          {/* Quick suggestions when no messages */}
          {messages.length <= 1 && (
            <div className="p-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
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

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about onboarding..."
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

export default Chatbot;
