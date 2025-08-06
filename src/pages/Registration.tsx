import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


const RegistrationPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    
    navigate('/onboarding'); 
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img
              src="/logo.png"
              alt="Synchrony Logo"
              className="h-16 w-auto"
            />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow pt-20">
        <div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
   
    <div className="mb-10 md:mb-16">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Get in touch</h2>

      <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
        Please fill out the registration form to create your onboarding profile. This information will help us tailor your experience based on your role, team, and preferences.
    </p>
</div>
    
    <form className="mx-auto grid max-w-screen-md gap-4 sm:grid-cols-2">
      <div>
        <label for="first-name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">First name*</label>
        <input name="first-name" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-yellow-300 transition duration-100 focus:ring" />
      </div>

      <div>
        <label for="last-name" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Last name*</label>
        <input name="last-name" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-yellow-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label for="company" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Company</label>
        <input name="company" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-yellow-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label for="email" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Email*</label>
        <input name="email" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-yellow-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label for="subject" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Subject*</label>
        <input name="subject" className="w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-yellow-300 transition duration-100 focus:ring" />
      </div>

      <div className="sm:col-span-2">
        <label for="message" className="mb-2 inline-block text-sm text-gray-800 sm:text-base">Message*</label>
        <textarea name="message" className="h-64 w-full rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-yellow-300 transition duration-100 focus:ring"></textarea>
      </div>

      <div className="flex items-center justify-between sm:col-span-2">
        <button className="inline-block rounded-lg bg-yellow-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-yellow-300 transition duration-100 hover:bg-yellow-600 focus-visible:ring active:bg-yellow-700 md:text-base">Send</button>

        <span className="text-sm text-gray-500">*Required</span>
      </div>

      <p className="text-xs text-gray-400">By signing up to our newsletter you agree to our <a href="#" className="underline transition duration-100 hover:text-yellow-500 active:text-yellow-600">Privacy Policy</a>.</p>
    </form>
  </div>
</div>
      </div>
      

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RegistrationPage;
