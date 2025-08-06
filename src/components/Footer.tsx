import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
     <footer className="bg-white text-gray-600 body-font mt-12">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img src="/logo.png" alt="Synchrony Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl"></span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 Synchrony — <a href="#" className="text-gray-600 ml-1" target="_blank" rel="noopener noreferrer">@Synchrony</a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            {/* Optional Social Icons */}
          </span>
        </div>
      </footer>
  );
};

export default Footer;


