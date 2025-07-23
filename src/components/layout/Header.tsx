// components/layout/Header.tsx
'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionContext } from '@/app/dashboard/layout';
import { usePathname } from 'next/navigation';
import { memo, useMemo } from 'react';

const Header = memo(() => {
  const { activeSession } = useSessionContext();
  const pathname = usePathname();

  const title = useMemo(() => {
    if (activeSession) {
      return activeSession.title;
    }
    
    if (pathname === '/dashboard') {
      return 'Dashboard';
    }
    
    if (pathname.startsWith('/dashboard/chat')) {
      return 'Chat Session';
    }
    
    return 'Pentagon Chat';
  }, [activeSession, pathname]);

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;