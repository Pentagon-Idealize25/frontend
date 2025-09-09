// ChatPage.tsx - Professional Chat Page
'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { 
  Loader2, 
  MessageCircle, 
  AlertCircle, 
  RefreshCw,
  ArrowLeft 
} from 'lucide-react';

import ChatInterface from '@/components/chat/ChatInterface';
import { cn } from '@/lib/utils/utils';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

interface ApiMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatPageState {
  messages: ApiMessage[];
  loading: boolean;
  error: string | null;
  retryCount: number;
}

const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 2000;
const THROTTLE_MS = 1000;

// Helper function to validate ObjectId format
const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const ChatPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const lastFetchTimeRef = useRef<number>(0);

  const [state, setState] = useState<ChatPageState>({
    messages: [],
    loading: true,
    error: null,
    retryCount: 0
  });

  // Memoized computed values
  const { messageCount, sessionIdDisplay } = useMemo(() => ({
    messageCount: state.messages.length,
    sessionIdDisplay: sessionId?.slice(-8) || ''
  }), [state.messages.length, sessionId]);

  const fetchMessages = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Throttle requests unless forced
    if (!force && now - lastFetchTimeRef.current < THROTTLE_MS) {
      console.log('Request throttled');
      return;
    }

    if (!sessionId) {
      console.log('No session ID provided');
      setState(prev => ({ 
        ...prev, 
        error: 'Invalid session ID',
        loading: false 
      }));
      return;
    }

    if (!isValidObjectId(sessionId)) {
      console.log('Invalid session ID format:', sessionId);
      setState(prev => ({ 
        ...prev, 
        error: 'Invalid session ID format',
        loading: false 
      }));
      return;
    }

    console.log(`Fetching messages for session: ${sessionId}, force: ${force}`);

    try {
      if (force) {
        setState(prev => ({ 
          ...prev, 
          loading: true, 
          error: null 
        }));
      }
      
      const response = await axios.get(
        `${BASE_URL}/messages/${sessionId}`,
        { timeout: 10000 }
      );
      
      console.log('API Response:', response.data);
      lastFetchTimeRef.current = now;
      
      setState(prev => {
        const newMessages = response.data || []; // Handle null/undefined response
        const hasChanged = JSON.stringify(prev.messages) !== JSON.stringify(newMessages);
        
        console.log(`Messages changed: ${hasChanged}, Count: ${newMessages.length}`);
        
        return {
          ...prev,
          messages: hasChanged ? newMessages : prev.messages,
          loading: false,
          error: null,
          retryCount: 0
        };
      });
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          errorMessage = 'Invalid session ID format';
        } else if (error.response?.status === 404) {
          // Session not found, might be new - treat as empty session
          console.log('Session not found, treating as new session');
          setState(prev => ({
            ...prev,
            messages: [],
            loading: false,
            error: null,
            retryCount: 0
          }));
          lastFetchTimeRef.current = now;
          return;
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
          errorMessage = 'Cannot connect to server. Please check if the backend is running.';
        } else {
          errorMessage = error.response?.data?.message || error.message || 'Failed to load messages';
        }
      }

      setState(prev => ({
        ...prev,
        loading: force ? false : prev.loading,
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));

      if (force) {
        toast.error(errorMessage);
      }
    }
  }, [sessionId]);

  const handleRetry = useCallback(() => {
    if (state.retryCount < MAX_RETRY_COUNT) {
      setTimeout(() => fetchMessages(true), RETRY_DELAY_MS);
    }
  }, [fetchMessages, state.retryCount]);

  const handleNewMessage = useCallback(() => {
    fetchMessages(false);
  }, [fetchMessages]);

  const handleBack = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  // Initial load effect
  useEffect(() => {
    if (sessionId) {
      fetchMessages(true);
    }
  }, [sessionId, fetchMessages]);

  // Loading state
  if (state.loading) {
    return (
      <div className="h-full flex flex-col">
        <LoadingState messageCount={messageCount} sessionId={sessionIdDisplay} />
      </div>
    );
  }

  // Error state
  if (state.error && state.messages.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <ErrorState 
          error={state.error}
          retryCount={state.retryCount}
          maxRetries={MAX_RETRY_COUNT}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Professional Header */}
      {/* <ChatHeader 
        messageCount={messageCount}
        sessionId={sessionIdDisplay}
        onBack={handleBack}
        hasError={!!state.error}
      /> */}

      {/* Chat Interface */}
      <div className="flex-1 min-h-0">
        <ChatInterface 
          sessionId={sessionId} 
          initialMessages={state.messages}
          onNewMessage={handleNewMessage} 
        />
      </div>
    </div>
  );
};

// Header Component
// interface ChatHeaderProps {
//   messageCount: number;
//   sessionId: string;
//   onBack: () => void;
//   hasError: boolean;
// }

// const ChatHeader: React.FC<ChatHeaderProps> = ({ 
//   messageCount, 
//   sessionId, 
//   onBack, 
//   hasError 
// }) => (
//   <header className={cn(
//     "px-6 py-4 border-b",
//     "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
//     hasError ? "border-red-200 dark:border-red-800" : "border-gray-200 dark:border-gray-700",
//     "transition-all duration-200"
//   )}>
//     <div className="flex items-center justify-between">
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={onBack}
//           className={cn(
//             "p-2 rounded-lg transition-colors",
//             "hover:bg-gray-100 dark:hover:bg-gray-800",
//             "focus:outline-none focus:ring-2 focus:ring-gray-500",
//             "text-gray-600 dark:text-gray-400"
//           )}
//           aria-label="Go back to dashboard"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </button>
        
//         <div className="flex items-center space-x-3">
//           <div className={cn(
//             "w-10 h-10 rounded-full flex items-center justify-center",
//             "bg-gradient-to-br from-gray-900 to-gray-700",
//             "dark:from-gray-100 dark:to-gray-300",
//             "shadow-sm"
//           )}>
//             <MessageCircle className="w-5 h-5 text-white dark:text-gray-900" />
//           </div>
          
//           <div>
//             <h1 className="font-semibold text-gray-900 dark:text-white">
//               Chat Session
//             </h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400">
//               {messageCount} {messageCount === 1 ? 'message' : 'messages'}
//             </p>
//           </div>
//         </div>
//       </div>
      
//       <div className="flex items-center space-x-2">
//         {hasError && (
//           <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
//             <AlertCircle className="w-4 h-4" />
//             <span className="text-xs font-medium">Connection issues</span>
//           </div>
//         )}
        
//         <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
//           <Hash className="w-3 h-3" />
//           <span className="font-mono">{sessionId}</span>
//         </div>
//       </div>
//     </div>
//   </header>
// );

// Loading State Component
interface LoadingStateProps {
  messageCount: number;
  sessionId: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ messageCount, sessionId }) => (
  <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8">
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-sm">
        <MessageCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="absolute -bottom-1 -right-1">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    </div>
    
    <div className="text-center max-w-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Loading conversation
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        {messageCount > 0 
          ? `Fetching ${messageCount} messages...`
          : 'Preparing your chat session...'
        }
      </p>
      {sessionId && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">
          Session: {sessionId}
        </p>
      )}
    </div>
  </div>
);

// Error State Component
interface ErrorStateProps {
  error: string;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  retryCount, 
  maxRetries, 
  onRetry, 
  onBack 
}) => (
  <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8">
    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
      <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
    </div>
    
    <div className="text-center max-w-md">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Failed to load conversation
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        {error}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {retryCount < maxRetries && (
          <button
            onClick={onRetry}
            className={cn(
              "inline-flex items-center px-4 py-2 rounded-lg",
              "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
              "hover:bg-gray-700 dark:hover:bg-gray-100",
              "focus:outline-none focus:ring-2 focus:ring-gray-500",
              "transition-colors text-sm font-medium"
            )}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry ({retryCount}/{maxRetries})
          </button>
        )}
        
        <button
          onClick={onBack}
          className={cn(
            "inline-flex items-center px-4 py-2 rounded-lg",
            "border border-gray-300 dark:border-gray-600",
            "text-gray-700 dark:text-gray-300",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            "focus:outline-none focus:ring-2 focus:ring-gray-500",
            "transition-colors text-sm font-medium"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  </div>
);

export default ChatPage;