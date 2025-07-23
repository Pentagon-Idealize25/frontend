// ChatLayout.tsx - Professional Layout
'use client';

import React from 'react';
import { cn } from '@/lib/utils/utils';

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <div className={cn(
      "h-screen flex flex-col",
      "bg-gradient-to-br from-gray-50 to-gray-100",
      "dark:from-gray-900 dark:to-gray-800",
      "transition-colors duration-300"
    )}>
      {/* Main Content Container */}
      <main className="flex-1 min-h-0 relative">
        <div className={cn(
          "h-full",
          "bg-white/80 dark:bg-gray-900/80",
          "backdrop-blur-sm",
          "border border-gray-200/50 dark:border-gray-700/50",
          "rounded-lg shadow-sm",
          "mx-2 my-2",
          "overflow-hidden"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;