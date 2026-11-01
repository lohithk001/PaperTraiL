import React from 'react';
import { MessageSquare, Bell, CheckCircle } from 'lucide-react';
import { useDocumentContext } from '../context/DocumentContext';

export const Header: React.FC = () => {
  const { 
    userProfile, 
    unreadNotificationsCount, 
    setIsNotificationsOpen, 
    setIsAssistantOpen 
  } = useDocumentContext();

  return (
    <header className="pt-2 pb-4 px-6 flex items-center justify-between">
      {/* Profile info on the left */}
      <div className="flex items-center gap-3">
        {/* Circular Avatar Illustration */}
        <div className="relative group cursor-pointer">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-primary/20 bg-gradient-to-tr from-pink-200 via-rose-100 to-indigo-100 flex items-center justify-center">
            {/* Illustrated avatar matching reference styling */}
            <svg
              className="w-10 h-10 transform translate-y-1"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pink Beanie */}
              <path
                d="M26 44 C26 24, 74 24, 74 44 Z"
                fill="#F472B6"
              />
              <path
                d="M24 42 C24 38, 76 38, 76 42 L74 48 L26 48 Z"
                fill="#EC4899"
              />
              {/* Pom-pom */}
              <circle cx="50" cy="20" r="7" fill="#FBCFE8" />
              {/* Face */}
              <path
                d="M32 46 C32 46, 32 72, 50 72 C68 72, 68 46, 68 46 Z"
                fill="#FED7AA"
              />
              {/* Hair strands */}
              <path d="M30 46 C34 46, 38 48, 36 52 Z" fill="#9A3412" />
              <path d="M70 46 C66 46, 62 48, 64 52 Z" fill="#9A3412" />
              {/* Round glasses */}
              <circle cx="42" cy="54" r="7" stroke="#1F242D" strokeWidth="2.5" fill="none" />
              <circle cx="58" cy="54" r="7" stroke="#1F242D" strokeWidth="2.5" fill="none" />
              <path d="M49 54 L51 54" stroke="#1F242D" strokeWidth="2.5" />
              {/* Eyes */}
              <circle cx="42" cy="54" r="2" fill="#1F242D" />
              <circle cx="58" cy="54" r="2" fill="#1F242D" />
              {/* Smile */}
              <path
                d="M45 64 Q50 67 55 64"
                stroke="#1F242D"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cheeks */}
              <circle cx="36" cy="58" r="3" fill="#FDA4AF" opacity="0.6" />
              <circle cx="64" cy="58" r="3" fill="#FDA4AF" opacity="0.6" />
              {/* Shirt collar */}
              <path
                d="M30 72 L38 85 L62 85 L70 72"
                fill="#E0E7FF"
              />
            </svg>
          </div>
          {/* Active status pulse */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>

        {/* User Name & Subtitle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[15px] text-charcoal-900 tracking-tight">
              {userProfile.name}
            </span>
            <CheckCircle className="w-4 h-4 text-primary fill-primary/10" />
          </div>
          <span className="text-[12px] font-semibold text-primary tracking-tight">
            {userProfile.tagline}
          </span>
        </div>
      </div>

      {/* Action Buttons on the right */}
      <div className="flex items-center gap-2.5">
        {/* Chat / Assistant button */}
        <button
          onClick={() => setIsAssistantOpen(true)}
          title="PaperTrail Assistant"
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center border border-charcoal-200/70 shadow-sm hover:border-primary/40 hover:bg-neutral-50 active:scale-95 transition-all text-charcoal-700"
        >
          <MessageSquare className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Notifications button */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          title="Notifications"
          className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center border border-charcoal-200/70 shadow-sm hover:border-primary/40 hover:bg-neutral-50 active:scale-95 transition-all text-charcoal-700"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </header>
  );
};
