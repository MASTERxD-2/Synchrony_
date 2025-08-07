import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <img
              src="/logo.png"
              alt="Synchrony Logo"
              className="mx-auto h-16 w-auto mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Synchrony Onboarding Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              "Everything you need to start strong – tailored just for you."
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Existing users can log in to access their personalized onboarding experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img
              src="/logo.png"
              alt="Synchrony Logo"
              className="mx-auto h-16 w-auto mb-4"
            />
            <span className="ml-3 text-xl"></span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 Synchrony —
            <a
              href="https://twitter.com/knyttneve"
              className="text-gray-600 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            ></a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            {/* Social icons */}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
