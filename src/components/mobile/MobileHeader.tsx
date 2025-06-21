import React from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileHeaderProps {
  username?: string | null;
  title: string;
}

export function MobileHeader({ title, username }: MobileHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header 
      className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 bg-telegram-blue dark:text-white"
    >
      {showBack && (
        <button
          onClick={handleBack}
          className="p-1 -ml-1 rounded-full hover:bg-white/10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      <div className="container mx-auto flex flex-col items-start">
          <div className="flex items-center gap-3">
              { username && <Send size={20} className="text-white" /> }
              <h1 className="text-2xl font-medium text-white">{title}</h1> {/* Adjust font size */}
          </div>
          {username && 
          (
          <div className="ml-10">
              <span className="text-sm opacity-90 font-medium text-white">Welcome,</span> {/* Adjust font size */}
              <span className="text-sm font-semibold text-white">@{username}</span> {/* Adjust font size */}
          </div>)}

      </div>
    </header>
  );
}