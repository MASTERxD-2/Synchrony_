import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-16">
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
              Get started with your personalized onboarding journey tailored to your role and experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">New Employee Portal</CardTitle>
                <CardDescription>
                  Get your personalized onboarding checklist based on your role, department, and experience level.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="w-full"
                  size="lg"
                >
                  Start My Onboarding
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Existing users can log in to access their personalized onboarding experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/login')}
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
            <a href="https://twitter.com/knyttneve" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank"></a>
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
