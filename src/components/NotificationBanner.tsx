// File: src/components/NotificationBanner.tsx
import React from 'react';

interface NotificationBannerProps {
  message: string;
  onClose: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, onClose }) => {
  return (
    <div className="relative flex flex-wrap bg-indigo-500 px-4 py-3 sm:flex-nowrap sm:items-center sm:justify-center sm:gap-3 sm:pr-8 md:px-8 z-50">
      <div className="order-1 mb-2 inline-block w-11/12 max-w-screen-sm text-sm text-white sm:order-none sm:mb-0 sm:w-auto md:text-base">
        {message}
      </div>

      <div className="order-2 flex w-1/12 items-start justify-end sm:absolute sm:right-0 sm:order-none sm:mr-1 sm:w-auto xl:mr-3">
        <button
          type="button"
          className="text-white transition duration-100 hover:text-indigo-100 active:text-indigo-200"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
