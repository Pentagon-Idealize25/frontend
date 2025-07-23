// // components/layout/SessionsSidebar.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { Plus, Trash2, Search, X } from 'lucide-react';
// import { useAuth } from '@/lib/context/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useSessionContext } from '@/app/dashboard/layout';
// import axios from 'axios'
// import {toast} from 'sonner'
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

// const SessionsSidebar = ({ 
//   onClose,
//   setActiveSession
// }: { 
//   onClose?: () => void;
//   setActiveSession: (session: { id: string; title: string } | null) => void;
// }) => {
//   const { user } = useAuth();
//   const router = useRouter();
//   const [sessions, setSessions] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//    const { activeSession } = useSessionContext(); // Moved to top level
//    const {logout} =useAuth();
//    const  BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  
//   const getSessions=async()=>{
//     const res=await axios.get(`${BASE_URL}/sessions`,{withCredentials:true});
//     return res.data.sessions;
//   }

//   const fetchSessions = async () => {
//       try {
//         const data = await getSessions();
//         setSessions(data);
//       } catch (error) {
//         toast.error('Failed to load chat sessions');
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       //   if (mockSessions.length > 0) {
//       //   setActiveSession({ id: mockSessions[0].id, title: mockSessions[0].title });
//       // }
//       }
//     };
//   useEffect(() => {
    

//     fetchSessions();
//   }, [setActiveSession]);


//   const filteredSessions = sessions.filter(session => 
//     session.title.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const createNewSession = async() => {
//     const newId = Date.now().toString();
//     const res = await axios.post(`${BASE_URL}/sessions/create`,{title:"New legal consultation"},{withCredentials:true})
    
//     // setSessions([newSession, ...sessions]);
//     // setActiveSession({ id: newId, title: newSession.title });
//     // router.push(`/dashboard/chat/${newId}`);
//     fetchSessions();
//     if (onClose) onClose();
//   };

//   const deleteSession = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setSessions(sessions.filter(session => session.id !== id));
    
//     // Use activeSession from top level
//     if (activeSession?.id === id) {
//       if (sessions.length > 1) {
//         const nextSession = sessions.find(session => session.id !== id);
//         if (nextSession) {
//           setActiveSession({ id: nextSession.id, title: nextSession.title });
//           router.push(`/dashboard/chat/${nextSession.id}`);
//         }
//       } else {
//         setActiveSession(null);
//       }
//     }
//   };

//   const handleSessionClick = (session: any) => {
//     setActiveSession({ id: session.id, title: session.title });
//     router.push(`/dashboard/chat/${session.id}`);
//     if (onClose) onClose();
//   };

//   const handleLogout = async () => {
//   setActiveSession(null);

//   const logoutPromise = toast.promise(
//     logout(), // This is the async function being tracked
//     {
//       loading: 'Logging out...',
//       success: 'Logged out successfully!',
//       error: 'Logout failed. Please try again.',
//     }
//   );

//   try {
//     await logoutPromise;
//     setTimeout(()=>{
//       window.location.href = '/';
//     },1000)
//      // Full page reload to root
//   } catch (error) {
//     // No need to toast here again, it's already handled in toast.promise
//     console.error('Logout error:', error);
//   }
// };
//   return (
//     <aside className="w-64 h-full flex flex-col ">
//       <div className="p-4 border-b">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-xl font-bold">Legal Sessions</h1>
//           <div className="flex gap-2">
//             <Button 
//               variant="outline" 
//               size="icon" 
//               onClick={createNewSession}
//               title="Start new session"
//             >
//               <Plus className="h-4 w-4" />
//             </Button>
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="md:hidden"
//               onClick={onClose}
//               title="Close sidebar"
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>
        
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search sessions..."
//             className="pl-10 pr-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <X 
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
//               onClick={() => setSearchTerm('')}
//             />
//           )}
//         </div>
//       </div>
      
//       <div className="flex-1 overflow-y-auto">
//         {isLoading ? (
//           <div className="p-4 space-y-3">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="animate-pulse">
//                 <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         ) : filteredSessions.length > 0 ? (
//           <ul className="py-2">
//             {filteredSessions.map((session) => (
//     <li key={session.id}>
//       <div
//         onClick={() => handleSessionClick(session)}
//         className={`block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 ${
//           // Use activeSession from top level
//           activeSession?.id === session.id 
//             ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500' 
//             : ''
//         }`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium truncate">{session.title}</p>
//                       <div className="flex items-center justify-between mt-1">
//                         <span className="text-xs text-gray-500">{session.date}</span>
//                         {session.unread > 0 && (
//                           <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                             {session.unread}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <Button 
//                       variant="ghost" 
//                       size="icon" 
//                       className="h-6 w-6 text-gray-500 hover:text-red-500"
//                       onClick={(e) => deleteSession(session.id, e)}
//                       title="Delete session"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="p-4 text-center">
//             <p className="text-gray-500">No sessions found</p>
//             <Button variant="link" onClick={createNewSession}>
//               Start a new session
//             </Button>
//           </div>
//         )}
//       </div>
      
//       {user && (
//         <div className="p-4 border-t">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
//               <div>
//                 <p className="font-medium truncate max-w-[120px]">{user.username}</p>
//                 <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
//               </div>
//             </div>
//             <Button 
//               variant="ghost" 
//               size="icon"
//               onClick={handleLogout}
//               title="Logout"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
//               </svg>
//             </Button>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// };

// export default SessionsSidebar;



// components/layout/SessionsSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, X, MessageSquare, Calendar, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@/app/dashboard/layout';
import axios from 'axios'
import {toast} from 'sonner'
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
  const [sessions, setSessions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
   const { activeSession } = useSessionContext();
   const {logout} =useAuth();
   const  BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
  
  const getSessions=async()=>{
    const res=await axios.get(`${BASE_URL}/sessions`,{withCredentials:true});
    return res.data.sessions;
  }

  const fetchSessions = async () => {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (error) {
        toast.error('Failed to load chat sessions');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
  useEffect(() => {
    fetchSessions();
  }, [setActiveSession]);

  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewSession = async() => {
    const newId = Date.now().toString();
    const res = await axios.post(`${BASE_URL}/sessions/create`,{title:"New legal consultation"},{withCredentials:true})
    fetchSessions();
    if (onClose) onClose();
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(sessions.filter(session => session.id !== id));
    
    if (activeSession?.id === id) {
      if (sessions.length > 1) {
        const nextSession = sessions.find(session => session.id !== id);
        if (nextSession) {
          setActiveSession({ id: nextSession.id, title: nextSession.title });
          router.push(`/dashboard/chat/${nextSession.id}`);
        }
      } else {
        setActiveSession(null);
      }
    }
  };

  const handleSessionClick = (session: any) => {
    setActiveSession({ id: session.id, title: session.title });
    router.push(`/dashboard/chat/${session.id}`);
    if (onClose) onClose();
  };

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
      setTimeout(()=>{
        window.location.href = '/';
      },1000)
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
            <div className="p-2 bg-blue-600 rounded-lg">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 mb-4 transition-colors duration-200"
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
        ) : filteredSessions.length > 0 ? (
          <div className="p-4 space-y-2">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSessionClick(session)}
                className={`group relative p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                  activeSession?.id === session.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-md ${
                        activeSession?.id === session.id 
                          ? 'bg-blue-100 dark:bg-blue-900/40' 
                          : 'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        <MessageSquare className={`h-3.5 w-3.5 ${
                          activeSession?.id === session.id 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate text-sm mb-1 ${
                          activeSession?.id === session.id 
                            ? 'text-blue-900 dark:text-blue-100' 
                            : 'text-slate-900 dark:text-slate-100'
                        }`}>
                          {session.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>{session.date}</span>
                          {session.unread > 0 && (
                            <div className="ml-auto">
                              <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                {session.unread}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                    onClick={(e) => deleteSession(session.id, e)}
                    title="Delete session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 font-medium">No sessions found</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
              Start your first legal consultation
            </p>
            <Button 
              variant="outline" 
              onClick={createNewSession}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Session
            </Button>
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