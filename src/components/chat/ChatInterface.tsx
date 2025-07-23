// // ChatInterface.tsx - Optimized Professional Version
// 'use client';

// import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { toast } from 'sonner';
// import { createMessage } from '@/lib/api/chat';
// import { useAuth } from '@/lib/context/AuthContext';
// import ChatInput from './ChatInput';
// import MessageBubble from './MessageBubble';
// import { MessageCircle } from 'lucide-react';
// import axios from 'axios';

// const FormMessageSchema = z.object({
//   content: z.string().min(1, { message: 'Message cannot be empty' })
// });

// type FormData = z.infer<typeof FormMessageSchema>;

// interface Message {
//   id: string;
//   session_id: string;
//   sender: 'user' | 'bot';
//   content: string;
//   timestamp: string;
//   isTemporary?: boolean;
// }

// interface ChatInterfaceProps {
//   sessionId: string;
//   initialMessages: Message[];
//   onNewMessage: () => void;
// }

// const EmptyState = memo(() => (
//   <div className="flex-1 flex items-center justify-center p-8">
//     <div className="text-center max-w-md">
//       <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center shadow-sm">
//         <MessageCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
//       </div>
//       <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
//         Start a conversation
//       </h3>
//       <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
//         Send a message to begin chatting with the AI assistant. Your conversation will appear here.
//       </p>
//     </div>
//   </div>
// ));

// EmptyState.displayName = 'EmptyState';

// const TypingIndicator = memo(() => (
//   <div className="flex justify-start mb-4">
//     <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
//       <div className="flex space-x-1">
//         {[0, 1, 2].map((index) => (
//           <div 
//             key={index}
//             className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" 
//             style={{ animationDelay: `${index * 0.15}s`, animationDuration: '1s' }}
//           />
//         ))}
//       </div>
//       <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
//         AI is thinking...
//       </span>
//     </div>
//   </div>
// ));

// TypingIndicator.displayName = 'TypingIndicator';

// const ChatInterface = memo(({ 
//   sessionId, 
//   initialMessages
// }: ChatInterfaceProps) => {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [isSending, setIsSending] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const [shouldMaintainScroll, setShouldMaintainScroll] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { user } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm<FormData>({
//     resolver: zodResolver(FormMessageSchema),
//     defaultValues: {
//       content: ''
//     }
//   });

//   // Memoize filtered messages to avoid recalculation
//   const { visibleMessages, hasMessages } = useMemo(() => {
//     const visible = messages;
//     return {
//       visibleMessages: visible,
//       hasMessages: visible.length > 0
//     };
//   }, [messages]);

//   useEffect(() => {
//     const hasChanged = 
//       initialMessages.length !== messages.filter(m => !m.isTemporary).length ||
//       initialMessages.some((msg, index) => {
//         const nonTempMessages = messages.filter(m => !m.isTemporary);
//         return !nonTempMessages[index] || nonTempMessages[index].id !== msg.id;
//       });

//     if (hasChanged) {
//       setMessages(prev => {
//         const tempMessages = prev.filter(m => m.isTemporary);
//         return [...initialMessages, ...tempMessages];
//       });
//     }
//   }, [initialMessages, messages]);

//   useEffect(() => {
//     if (shouldMaintainScroll) {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [visibleMessages, isTyping, shouldMaintainScroll]);

//   const fetchLatestMessages = useCallback(async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/messages/${sessionId}`);
//       const latestMessages = response.data;
      
//       setMessages(prev => {
//         const realMessages = prev.filter(m => !m.isTemporary);
//         if (latestMessages.length > realMessages.length) {
//           return latestMessages;
//         }
//         return prev;
//       });
      
//       setIsTyping(false);
//     } catch (error) {
//       console.error('Error fetching latest messages:', error);
//       setIsTyping(false);
//     }
//   }, [sessionId]);

//   const onSubmit = useCallback(async (data: FormData) => {
//     if (!user) {
//       toast.error('You must be logged in to send messages');
//       return;
//     }

//     const tempId = `temp-${Date.now()}`;
//     const tempUserMessage: Message = {
//       id: tempId,
//       session_id: sessionId,
//       sender: 'user',
//       content: data.content,
//       timestamp: new Date().toISOString(),
//       isTemporary: true
//     };

//     try {
//       setIsSending(true);
//       setShouldMaintainScroll(true);
      
//       setMessages(prev => [...prev, tempUserMessage]);
//       reset();
//       setTimeout(() => setIsTyping(true), 500);
      
//       await createMessage({
//         session_id: sessionId,
//         sender: 'user',
//         content: data.content,
//       });
      
//       setTimeout(fetchLatestMessages, 1500);
      
//     } catch (err) {
//       toast.error('Message sending failed');
//       console.error(err);
//       setMessages(prev => prev.filter(msg => msg.id !== tempId));
//       setIsTyping(false);
//     } finally {
//       setIsSending(false);
//     }
//   }, [user, sessionId, reset, fetchLatestMessages]);

//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-gray-900">
//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
//         {!hasMessages ? (
//           <EmptyState />
//         ) : (
//           <div className="p-6 space-y-6 max-w-4xl mx-auto">
//             {visibleMessages.map((message, index) => (
//               <div 
//                 key={message.id} 
//                 className={`transition-all duration-300 ${
//                   message.isTemporary ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'
//                 } ${
//                   index === visibleMessages.length - 1 ? 'animate-in slide-in-from-bottom-2' : ''
//                 }`}
//               >
//                 <MessageBubble 
//                   message={{
//                     id: message.id,
//                     content: message.content,
//                     role: message.sender === 'bot' ? 'assistant' : 'user',
//                     created_at: message.timestamp
//                   }} 
//                 />
//               </div>
//             ))}
//             {isTyping && (
//               <div className="animate-in slide-in-from-bottom-2 duration-300">
//                 <TypingIndicator />
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
//         <div className="p-4 max-w-4xl mx-auto">
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <ChatInput<FormData>
//               name="content"
//               register={register}
//               error={errors.content?.message}
//               placeholder="Type your message..."
//               isSending={isSending}
//               disabled={isSending || isTyping}
//             />
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// });

// ChatInterface.displayName = 'ChatInterface';

// export default ChatInterface;






// ChatInterface.tsx - Professional Industrial Version
'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createMessage } from '@/lib/api/chat';
import { useAuth } from '@/lib/context/AuthContext';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { MessageSquare, Sparkles, Shield, Clock } from 'lucide-react';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

const FormMessageSchema = z.object({
  content: z.string().min(1, { message: 'Message cannot be empty' }).max(4000, { message: 'Message too long' })
});

type FormData = z.infer<typeof FormMessageSchema>;

interface Message {
  id: string;
  session_id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
  isTemporary?: boolean;
}

interface ChatInterfaceProps {
  sessionId: string;
  initialMessages: Message[];
  onNewMessage: () => void;
}

const EmptyState = memo(() => (
  <div className="flex-1 flex items-center justify-center p-8">
    <div className="text-center max-w-lg">
      {/* Hero Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl">
          <MessageSquare className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        Legal AI Assistant Ready
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8 max-w-md mx-auto">
        Start a conversation with our advanced legal AI. Get instant answers to your legal questions with professional-grade assistance.
      </p>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Secure & Confidential</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">24/7 Available</span>
        </div>
      </div>

      {/* CTA */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Type your legal question below to begin
      </p>
    </div>
  </div>
));

EmptyState.displayName = 'EmptyState';

const TypingIndicator = memo(() => (
  <div className="flex justify-start mb-6">
    <div className="flex items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl px-6 py-4 shadow-sm border border-slate-200 dark:border-slate-600">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
        <MessageSquare className="w-4 h-4 text-white" />
      </div>
      
      {/* Typing Animation */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <div 
              key={index}
              className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full animate-bounce" 
              style={{ 
                animationDelay: `${index * 0.2}s`, 
                animationDuration: '1.2s',
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-2">
          AI is analyzing your query...
        </span>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';

const ChatInterface = memo(({ 
  sessionId, 
  initialMessages,
  onNewMessage
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [shouldMaintainScroll, setShouldMaintainScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(FormMessageSchema),
    defaultValues: { content: '' }
  });

  const messageContent = watch('content');

  // Memoized message processing
  const { visibleMessages, hasMessages, messageCount } = useMemo(() => {
    const visible = messages.filter(m => m.content.trim().length > 0);
    return {
      visibleMessages: visible,
      hasMessages: visible.length > 0,
      messageCount: visible.length
    };
  }, [messages]);

  // Sync with initial messages
  useEffect(() => {
    const hasChanged = 
      initialMessages.length !== messages.filter(m => !m.isTemporary).length ||
      initialMessages.some((msg, index) => {
        const nonTempMessages = messages.filter(m => !m.isTemporary);
        return !nonTempMessages[index] || nonTempMessages[index].id !== msg.id;
      });

    if (hasChanged) {
      setMessages(prev => {
        const tempMessages = prev.filter(m => m.isTemporary);
        return [...initialMessages, ...tempMessages];
      });
    }
  }, [initialMessages, messages]);

  // Smart scrolling
  useEffect(() => {
    const container = messagesContainerRef.current;
    const endElement = messagesEndRef.current;
    
    if (!container || !endElement) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    if (shouldMaintainScroll || isNearBottom) {
      endElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [visibleMessages, isTyping, shouldMaintainScroll]);

  const fetchLatestMessages = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/messages/${sessionId}`, {
        withCredentials: true
      });
      const latestMessages = response.data;
      
      setMessages(prev => {
        const realMessages = prev.filter(m => !m.isTemporary);
        if (latestMessages.length > realMessages.length) {
          return latestMessages;
        }
        return prev;
      });
      
      setIsTyping(false);
      onNewMessage();
    } catch (error) {
      console.error('Error fetching latest messages:', error);
      setIsTyping(false);
      toast.error('Failed to load latest messages');
    }
  }, [sessionId, onNewMessage]);

  const onSubmit = useCallback(async (data: FormData) => {
    if (!user) {
      toast.error('Authentication required to send messages');
      return;
    }

    if (!data.content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempUserMessage: Message = {
      id: tempId,
      session_id: sessionId,
      sender: 'user',
      content: data.content.trim(),
      timestamp: new Date().toISOString(),
      isTemporary: true
    };

    try {
      setIsSending(true);
      setShouldMaintainScroll(true);
      
      // Add temporary message immediately for better UX
      setMessages(prev => [...prev, tempUserMessage]);
      reset();
      
      // Start typing indicator after a short delay
      setTimeout(() => setIsTyping(true), 800);
      
      // Send message to API
      await createMessage({
        session_id: sessionId,
        sender: 'user',
        content: data.content.trim(),
      });
      
      // Fetch response after processing time
      setTimeout(fetchLatestMessages, 2000);
      
    } catch (error) {
      console.error('Message sending failed:', error);
      toast.error('Failed to send message. Please try again.');
      
      // Remove temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setIsTyping(false);
    } finally {
      setIsSending(false);
    }
  }, [user, sessionId, reset, fetchLatestMessages, onNewMessage]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;
    setShouldMaintainScroll(isAtBottom);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        {!hasMessages ? (
          <EmptyState />
        ) : (
          <div className="p-6 space-y-8 max-w-4xl mx-auto">
            {/* Session Header */}
            {messageCount > 0 && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
                  <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Legal Consultation Session
                  </span>
                </div>
              </div>
            )}

            {/* Messages */}
            {visibleMessages.map((message, index) => (
              <div 
                key={message.id} 
                className={`transition-all duration-500 ${
                  message.isTemporary ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'
                } ${
                  index === visibleMessages.length - 1 && !message.isTemporary
                    ? 'animate-in slide-in-from-bottom-4 duration-500' 
                    : ''
                }`}
              >
                <MessageBubble 
                  message={{
                    id: message.id,
                    content: message.content,
                    role: message.sender === 'bot' ? 'assistant' : 'user',
                    created_at: message.timestamp
                  }} 
                />
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <TypingIndicator />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="p-6 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <ChatInput<FormData>
              name="content"
              register={register}
              error={errors.content?.message}
              placeholder={hasMessages ? "Continue the conversation..." : "Ask me any legal question..."}
              isSending={isSending}
              disabled={isSending || isTyping}
              maxLength={4000}
              showAttachments={false}
              showVoiceInput={false}
            />
            
            {/* Input Status */}
            {(isSending || isTyping) && (
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {isSending ? 'Sending...' : 'AI is processing...'}
                  </span>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;