import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/Onboarding";
import AdminPanel from "./components/AdminPanel";
import LoginPage from "./pages/Login";
import Preboarding from "./pages/Preboard";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";
import EnhancedChatbot from "./components/EnhancedChatbot";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import MyTasksPage from "./pages/MyTasksPage";
import UploadProject from "./pages/UploadProject";
import ViewProjects from "./pages/ViewProjects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatbotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/preboarding" element={<Preboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/mytasks" element={<MyTasksPage />} />
            <Route path="/uploadproject" element={<UploadProject />} />
            <Route path="/viewprojects" element={<ViewProjects />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* Enhanced Chatbot with context awareness */}
          <EnhancedChatbot />
        </BrowserRouter>
      </ChatbotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;