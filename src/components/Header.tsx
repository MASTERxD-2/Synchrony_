import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
     <header className="fixed top-0 left-0 right-0 z-50 text-gray-600 body-font shadow bg-white h-20">
    <div className="container mx-auto flex items-center justify-between h-full px-6">
      {/* Logo */}
      <a className="flex items-center text-gray-900 font-medium">
        <img src="/logo.png" alt="Synchrony Logo" className="h-12 w-auto" />
        <span className="ml-3 text-2xl font-semibold"></span>
      </a>

      {/* Profile & Logout */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/settings')}
          className="inline-block rounded-lg px-4 py-3 text-center text-sm font-semibold text-black outline-none ring-yellow-300 transition duration-100 hover:text-yellow-500 focus-visible:ring active:text-yellow-600 md:text-base"
        >
          Settings
        </button>

        <button 
          onClick={handleLogout}
          className="inline-block rounded-lg bg-yellow-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-yellow-300 transition duration-100 hover:bg-yellow-600 focus-visible:ring active:bg-yellow-700 md:text-base"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
  );
};

export default Header;
