// app/dashboard/page.tsx - Professional Dashboard Page
'use client';

import { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useSessionContext } from '@/app/dashboard/layout';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { MessageCircle, Plus, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface CreateSessionData {
  user_id: string;
  title: string;
}

interface SessionResponse {
  session_id: string;
}

// Professional Welcome Card Component
const WelcomeCard = memo(() => (
  <div className="text-center space-y-6 p-8">
    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
      <div className="relative">
        <MessageCircle className="w-10 h-10 text-gray-600 dark:text-gray-300" />
        <Sparkles className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" />
      </div>
    </div>
    
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Welcome to Pentagon Chat
      </h1>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
        Start a new conversation to begin your legal consultation with our AI assistant
      </p>
    </div>
  </div>
));

WelcomeCard.displayName = 'WelcomeCard';

// Professional Create Session Function
const createSession = async (
  userId: string, 
  setActiveSession: (session: { id: string; title: string }) => void, 
  router: ReturnType<typeof useRouter>,
  setIsLoading: (loading: boolean) => void
) => {
  setIsLoading(true);
  
  try {
    const data: CreateSessionData = {
      user_id: userId,
      title: "New Session"
    };

    const response = await axios.post<SessionResponse>(`${BASE_URL}/sessions`, data);
    const sessionId = response.data.session_id;
    
    // Set the new session as active
    setActiveSession({ id: sessionId, title: data.title });
    
    // Show success message
    toast.success('New conversation started!');
    
    // Redirect to the new chat session
    router.push(`/dashboard/chat/${sessionId}`);
  } catch (error) {
    console.error("Failed to create session:", error);
    toast.error('Failed to create new conversation. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

const DashboardPage = memo(() => {
  const { setActiveSession } = useSessionContext();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateSession = useCallback(() => {
    if (user?.id) {
      createSession(user.id, setActiveSession, router, setIsLoading);
    }
  }, [user?.id, setActiveSession, router]);

  // Don't render anything if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <WelcomeCard />
        </CardHeader>
        
        <CardContent className="pt-0">
          <Button 
            className="w-full h-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] font-semibold"
            onClick={handleCreateSession}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Start New Conversation
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            Your conversation will be saved automatically
          </p>
        </CardContent>
      </Card>
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;