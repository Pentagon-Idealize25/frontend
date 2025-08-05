// components/layout/SessionsSidebar.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, X, MessageSquare, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/app/dashboard/layout';
import axios from 'axios';
import { toast } from 'sonner';
import { Session } from '@/lib/api/sessions';
import SessionCard from '@/components/ui/SessionCard.enhanced';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

const SessionsSidebar = ({ 
  onClose,
  setActiveSession
}: { 
  onClose?: () => void;
  setActiveSession: (session: { id: string; title: string } | null) => void;
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { activeSession } = useSessionContext();
  const { logout } = useAuth();
  
  const getSessions = useCallback(async () => {
    const res = await axios.get(`${BASE_URL}/sessions`, { withCredentials: true });
    return res.data.sessions;
  }, []);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load chat sessions');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [getSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to get date label for grouping
  const getDateLabel = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return 'Today';
      if (isYesterday(date)) return 'Yesterday';
      return format(date, 'MMMM d, yyyy');
    } catch {
      console.warn('Invalid date format:', dateString);
      return 'Unknown Date';
    }
  };

  // Helper function to get date sort value (0 = Today, 1 = Yesterday, 2 = Other dates)
  const getDateSortValue = (dateString: string): number => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return 0;
      if (isYesterday(date)) return 1;
      return 2;
    } catch {
      return 3; // Put invalid dates at the end
    }
  };

  // Group sessions by date labels (Today, Yesterday, specific dates)
  const groupedSessions = filteredSessions.reduce((groups, session) => {
    const dateLabel = getDateLabel(session.created_at);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(session);
    return groups;
  }, {} as Record<string, Session[]>);

  // Sort groups: Today first, then Yesterday, then other dates (newest first)
  const sortedGroupKeys = Object.keys(groupedSessions).sort((a, b) => {
    // Find representative sessions for each group to get sort values
    const sessionA = groupedSessions[a][0];
    const sessionB = groupedSessions[b][0];
    const sortValueA = getDateSortValue(sessionA.created_at);
    const sortValueB = getDateSortValue(sessionB.created_at);
    
    if (sortValueA !== sortValueB) {
      return sortValueA - sortValueB;
    }
    
    // If both are in the "other dates" category, sort by actual date (newest first)
    if (sortValueA === 2 && sortValueB === 2) {
      try {
        return parseISO(sessionB.created_at).getTime() - parseISO(sessionA.created_at).getTime();
      } catch {
        return 0;
      }
    }
    
    return 0;
  });

  // Sort sessions within each group by creation time (newest first)
  Object.keys(groupedSessions).forEach(dateLabel => {
    groupedSessions[dateLabel].sort((a, b) => {
      try {
        return parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime();
      } catch {
        return 0;
      }
    });
  });

  const createNewSession = async () => {
    try {
      await axios.post(`${BASE_URL}/sessions/create`, { title: "New legal consultation" }, { withCredentials: true });
      await fetchSessions();
      if (onClose) onClose();
    } catch (error) {
      toast.error('Failed to create new session');
      console.error(error);
    }
  };

  const handleSessionClick = (session: Session) => {
    setActiveSession({ id: session.id, title: session.title });
    router.push(`/dashboard/chat/${session.id}`);
    if (onClose) onClose();
  };

  const handleSessionDeleted = useCallback(async (deletedSessionId: string) => {
    // Remove from local state
    setSessions(prevSessions => prevSessions.filter(session => session.id !== deletedSessionId));
    
    // Handle active session management
    if (activeSession?.id === deletedSessionId) {
      const remainingSessions = sessions.filter(session => session.id !== deletedSessionId);
      
      if (remainingSessions.length > 0) {
        // Set the first remaining session as active
        const nextSession = remainingSessions[0];
        setActiveSession({ id: nextSession.id, title: nextSession.title });
        router.push(`/dashboard/chat/${nextSession.id}`);
      } else {
        // No sessions left, clear active session
        setActiveSession(null);
        router.push('/dashboard');
      }
    }
    
    // Refresh sessions list to ensure consistency
    await fetchSessions();
  }, [activeSession, sessions, setActiveSession, router, fetchSessions]);

  const handleLogout = async () => {
    setActiveSession(null);

    const logoutPromise = toast.promise(
      logout(),
      {
        loading: 'Signing out...',
        success: 'Signed out successfully',
        error: 'Sign out failed. Please try again.',
      }
    );

    try {
      await logoutPromise;
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <aside className="w-80 h-full flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Legal Assistant
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Chat Sessions
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={onClose}
              title="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* New Session Button */}
        <Button 
          onClick={createNewSession}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 mb-4 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Consultation
        </Button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search sessions..."
            className="pl-10 pr-10 h-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <X 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>
      </div>
      
      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : Object.keys(groupedSessions).length > 0 ? (
          <div className="space-y-2">
            {sortedGroupKeys.map((dateLabel) => (
              <div key={dateLabel} className="space-y-1">
                {/* Date Header */}
                <div className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-slate-100/50 dark:bg-slate-800/50 sticky top-0 z-10 border-b border-slate-200/50 dark:border-slate-700/50">
                  {dateLabel}
                </div>
                {/* Sessions for this date */}
                <div className="space-y-1 pb-2">
                  {groupedSessions[dateLabel].map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={activeSession?.id === session.id}
                      onClick={() => handleSessionClick(session)}
                      onSessionUpdated={fetchSessions}
                      onSessionDeleted={handleSessionDeleted}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">
              {searchTerm ? 'No sessions match your search' : 'No sessions found'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Start your first legal consultation'}
            </p>
            {!searchTerm && (
              <Button 
                variant="outline" 
                onClick={createNewSession}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Session
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* User Profile Section */}
      {user && (
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl w-10 h-10 flex items-center justify-center shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-slate-900 dark:text-slate-100 text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex gap-1 ml-2">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SessionsSidebar;