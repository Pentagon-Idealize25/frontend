// 'use client';

// import { useState, useEffect, useCallback, memo } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { toast } from 'sonner';
// import SessionCard from '@/components/ui/SessionCard';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { PlusIcon } from '@radix-ui/react-icons';
// import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import axios from 'axios';

// const SessionCreateSchema = z.object({
//   title: z.string().min(1, { message: 'Title is required' })
// });

// type FormData = z.infer<typeof SessionCreateSchema>;

// interface ChatSession {
//   id: string;
//   title: string;
//   created_at: string;
//   updated_at: string;
// }

// interface ChatSessionListProps {
//   onSelectSession: (id: string) => void;
//   currentSessionId?: string;
// }

// // API functions
// const getSessions = async (): Promise<ChatSession[]> => {
//   try {
//     const response = await axios.get('http://localhost:8000/sessions', { withCredentials: true });
//     return response.data.sessions || [];
//   } catch (error) {
//     console.error('Error fetching sessions:', error);
//     throw error;
//   }
// };

// const createSession = async (title: string): Promise<ChatSession> => {
//   try {
//     const response = await axios.post(
//       'http://localhost:8000/sessions/create',
//       { title },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Error creating session:', error);
//     throw error;
//   }
// };

// const ChatSessionList = memo(({ 
//   onSelectSession,
//   currentSessionId 
// }: ChatSessionListProps) => {
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
  
//   const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(SessionCreateSchema),
//   });

//   const fetchSessions = useCallback(async () => {
//     try {
//       const data = await getSessions();
//       setSessions(data);
//     } catch (error) {
//       toast.error('Failed to load chat sessions');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchSessions();
//   }, [fetchSessions]);

//   const handleCreateSession = useCallback(async (data: FormData) => {
//     try {
//       const newSession = await createSession(data.title);
//       setSessions(prev => [newSession, ...prev]);
//       onSelectSession(newSession.id);
//       setShowCreateForm(false);
//       reset();
//       toast.success('New chat session created');
//     } catch (error) {
//       toast.error('Failed to create session');
//       console.error(error);
//     }
//   }, [onSelectSession, reset]);

//   const toggleCreateForm = useCallback(() => {
//     setShowCreateForm(prev => !prev);
//   }, []);

//   const cancelCreateForm = useCallback(() => {
//     setShowCreateForm(false);
//     reset();
//   }, [reset]);

//   if (loading) {
//     return (
//       <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
//         <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//           <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lawgan</h1>
//         </div>
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <LoadingSpinner size="lg" />
//             <p className="mt-4 text-gray-500 dark:text-gray-400">Loading sessions...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
//       {/* Header */}
//       <div className="p-6 border-b border-gray-200 dark:border-gray-700">
//         <h1 className="text-xl font-bold text-gray-900 dark:text-white">Lawgan</h1>
//       </div>
      
//       {/* Sessions Header */}
//       <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-800">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat Sessions</h2>
//         <Button 
//           size="sm" 
//           onClick={toggleCreateForm}
//           className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
//           aria-label="Create new chat session"
//         >
//           <PlusIcon className="h-4 w-4" />
//           New
//         </Button>
//       </div>

//       {/* Create Session Form */}
//       {showCreateForm && (
//         <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
//           <form onSubmit={handleSubmit(handleCreateSession)} className="space-y-4">
//             <Input
//               placeholder="Enter session title..."
//               {...register('title')}
//               error={errors.title?.message}
//               className="bg-white dark:bg-gray-900"
//             />
//             <div className="flex gap-3">
//               <Button 
//                 type="submit" 
//                 className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100"
//               >
//                 Create Session
//               </Button>
//               <Button 
//                 type="button"
//                 variant="outline" 
//                 className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 onClick={cancelCreateForm}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Sessions List */}
//       <div className="flex-1 overflow-y-auto">
//         {sessions.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full p-8 text-center">
//             <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
//               <PlusIcon className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               No chat sessions
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
//               Create your first chat session to get started
//             </p>
//             <Button 
//               onClick={toggleCreateForm}
//               className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100"
//             >
//               Create Session
//             </Button>
//           </div>
//         ) : (
//           <div className="p-4 space-y-2">
//             {sessions.map((session) => (
//               <SessionCard
//                 key={session.id}
//                 session={session}
//                 isActive={session.id === currentSessionId}
//                 onClick={() => onSelectSession(session.id)}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// ChatSessionList.displayName = 'ChatSessionList';

// export default ChatSessionList;



// ChatSessionList.tsx - Professional Industrial Version
'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import SessionCard from '@/components/ui/SessionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon, MessageSquare, Sparkles, TrendingUp, Shield, Search } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import axios from 'axios';

const SessionCreateSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title too long' })
    .trim()
});

type FormData = z.infer<typeof SessionCreateSchema>;

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

interface ChatSessionListProps {
  onSelectSession: (id: string) => void;
  currentSessionId?: string;
}

// Optimized API functions with better error handling
const getSessions = async (): Promise<ChatSession[]> => {
  try {
    const response = await axios.get('http://localhost:8000/sessions', { 
      withCredentials: true,
      timeout: 10000 
    });
    return response.data.sessions || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

const createSession = async (title: string): Promise<ChatSession> => {
  try {
    const response = await axios.post(
      'http://localhost:8000/sessions/create',
      { title: title.trim() },
      { 
        withCredentials: true,
        timeout: 10000
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Enhanced Loading Component
const LoadingState = memo(() => (
  <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700">
    <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Lawgan</h1>
      </div>
    </div>
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <LoadingSpinner size="lg" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Loading Sessions</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Preparing your legal consultations...</p>
        </div>
      </div>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

// Enhanced Empty State
const EmptyState = memo(({ onCreateSession }: { onCreateSession: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    {/* Hero Section */}
    <div className="relative mb-8">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl">
        <MessageSquare className="w-12 h-12 text-white" />
      </div>
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
    </div>

    {/* Content */}
    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
      Welcome to Legal AI
    </h3>
    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-sm">
      Start your first consultation session with our advanced legal AI assistant. Professional legal guidance at your fingertips.
    </p>

    {/* Feature Grid */}
    <div className="grid grid-cols-1 gap-3 mb-8 w-full max-w-sm">
      <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Confidential & Secure</span>
      </div>
      <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Expert AI Analysis</span>
      </div>
    </div>

    {/* CTA Button */}
    <Button 
      onClick={onCreateSession}
      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <PlusIcon className="w-5 h-5 mr-2" />
      Start Your First Session
    </Button>
  </div>
));

EmptyState.displayName = 'EmptyState';

const ChatSessionList = memo(({ 
  onSelectSession,
  currentSessionId 
}: ChatSessionListProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(SessionCreateSchema),
    defaultValues: { title: '' }
  });

  // Memoized filtered sessions
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    return sessions.filter(session => 
      session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sessions, searchQuery]);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load chat sessions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCreateSession = useCallback(async (data: FormData) => {
    try {
      const newSession = await createSession(data.title);
      setSessions(prev => [newSession, ...prev]);
      onSelectSession(newSession.id);
      setShowCreateForm(false);
      reset();
      toast.success('New consultation session created');
    } catch (error) {
      toast.error('Failed to create session');
      console.error(error);
    }
  }, [onSelectSession, reset]);

  const toggleCreateForm = useCallback(() => {
    setShowCreateForm(prev => {
      if (!prev) reset(); // Reset form when opening
      return !prev;
    });
  }, [reset]);

  const cancelCreateForm = useCallback(() => {
    setShowCreateForm(false);
    reset();
  }, [reset]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Lawgan</h1>
        </div>
      </div>
      
      {/* Sessions Control Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Legal Sessions</h2>
          <Button 
            size="sm" 
            onClick={toggleCreateForm}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            aria-label="Create new legal consultation session"
          >
            <PlusIcon className="h-4 w-4" />
            New
          </Button>
        </div>

        {/* Search Bar */}
        {sessions.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        )}
      </div>

      {/* Create Session Form */}
      {showCreateForm && (
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <form onSubmit={handleSubmit(handleCreateSession)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="session-title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Session Title
              </label>
              <Input
                id="session-title"
                placeholder="e.g., Contract Review, Legal Consultation..."
                {...register('title')}
                error={errors.title?.message}
                className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl"
                maxLength={100}
              />
            </div>
            <div className="flex gap-3">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Session'
                )}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium"
                onClick={cancelCreateForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {sessions.length === 0 ? (
          <EmptyState onCreateSession={toggleCreateForm} />
        ) : (
          <>
            {filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <Search className="w-12 h-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  No sessions found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No sessions match your search criteria
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredSessions.map((session, index) => (
                  <div 
                    key={session.id}
                    className="animate-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SessionCard
                      session={session}
                      isActive={session.id === currentSessionId}
                      onClick={() => onSelectSession(session.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Stats */}
      {sessions.length > 0 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-center">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {sessions.length} Total Session{sessions.length !== 1 ? 's' : ''}
              {searchQuery && ` • ${filteredSessions.length} Shown`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

ChatSessionList.displayName = 'ChatSessionList';

export default ChatSessionList;