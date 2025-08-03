'use client'

import { ReactNode, useState, createContext, useContext, memo, useCallback, useMemo, useEffect } from 'react';
import Header from '@/components/layout/Header';
import SessionsSidebar from '@/components/layout/SessionSidebar';
import { Toaster } from 'sonner';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

// Enhanced TypeScript interfaces
interface SessionData {
  id: string;
  title: string;
}

interface SessionContextType {
  activeSession: SessionData | null;
  setActiveSession: (session: SessionData | null) => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}

// Professional Loading Component
const LoadingScreen = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center space-y-4">
      <LoadingSpinner />
      <p className="text-gray-600 dark:text-gray-400 text-sm">Loading dashboard...</p>
    </div>
  </div>
));

LoadingScreen.displayName = 'LoadingScreen';

// Mobile Sidebar Toggle Component
const MobileSidebarToggle = memo(({ onClick }: { onClick: () => void }) => (
  <div className="md:hidden fixed top-4 left-4 z-50">
    <Button 
      variant="outline" 
      size="icon"
      onClick={onClick}
      className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  </div>
));

MobileSidebarToggle.displayName = 'MobileSidebarToggle';

// Sidebar Overlay Component
const SidebarOverlay = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  isOpen ? (
    <div 
      className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden transition-opacity"
      onClick={onClose}
      aria-hidden="true"
    />
  ) : null
));

SidebarOverlay.displayName = 'SidebarOverlay';

const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<SessionData | null>(null);
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Memoized handlers for better performance
  const handleSidebarOpen = useCallback(() => setIsSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setIsSidebarOpen(false), []);

  // Memoized context value
  const sessionContextValue = useMemo(() => ({
    activeSession,
    setActiveSession
  }), [activeSession]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return <LoadingScreen />;
  }

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <MobileSidebarToggle onClick={handleSidebarOpen} />

        {/* Sessions Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-xl ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:flex`}
        >
          <SessionsSidebar 
            onClose={handleSidebarClose} 
            setActiveSession={setActiveSession}
          />
        </div>
        
        <SidebarOverlay isOpen={isSidebarOpen} onClose={handleSidebarClose} />

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          
          <main className="flex-1 min-h-0 bg-white dark:bg-gray-900">
            {children}
          </main>
        </div>
        
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          }}
        />
      </div>
    </SessionContext.Provider>
  );
});

export default DashboardLayout;