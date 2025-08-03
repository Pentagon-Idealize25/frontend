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
      {/* Professional Hero Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl">
          <Shield className="w-14 h-14 text-white" />
        </div>
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Professional Content */}
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Professional Legal AI Assistant
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-md mx-auto">
        Get instant, professional legal guidance powered by advanced AI. Ask questions about contracts, regulations, compliance, and more.
      </p>

      {/* Professional Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confidential & Secure</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Instant Responses</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
          <MessageSquare className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expert Knowledge</span>
        </div>
      </div>

      {/* Professional CTA */}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Ready to start your consultation?
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Type your legal question below to begin professional assistance
        </p>
      </div>
    </div>
  </div>
));

EmptyState.displayName = 'EmptyState';

const TypingIndicator = memo(() => (
  <div className="flex justify-start mb-6">
    <div className="flex items-center gap-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl px-6 py-4 shadow-md border border-slate-200 dark:border-slate-600">
      {/* Professional AI Avatar */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
        <Shield className="w-5 h-5 text-white" />
      </div>

      {/* Enhanced Typing Animation */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-bounce shadow-sm"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.4s',
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Legal AI Assistant
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Analyzing your legal query...
          </span>
        </div>
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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const handleFileSelect = (files: FileList) => {
    setAttachedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceToggle = () => {
    setIsVoiceRecording(prev => !prev);
    // TODO: Implement actual voice recording functionality
    if (!isVoiceRecording) {
      toast.info('Voice recording started');
    } else {
      toast.info('Voice recording stopped');
    }
  };

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
  }, [user, sessionId, reset, fetchLatestMessages]);



  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f8fafc' }}
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
                className={`transition-all duration-500 ${message.isTemporary ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'
                  } ${index === visibleMessages.length - 1 && !message.isTemporary
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

      {/* Professional Input Area */}
      <div className="flex-shrink-0  backdrop-blur-sm shadow-lg">
        <div className="p-4 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <ChatInput<FormData>
              name="content"
              register={register}
              error={errors.content?.message}
              placeholder={hasMessages ? "Continue the conversation..." : "Ask me any legal question..."}
              isSending={isSending}
              disabled={isSending || isTyping}
              maxLength={4000}
              showAttachments={true}
              showVoiceInput={true}
              attachedFiles={attachedFiles}
              onFileSelect={handleFileSelect}
              onRemoveFile={handleRemoveFile}
              onVoiceToggle={handleVoiceToggle}
              isVoiceRecording={isVoiceRecording}
              value={watch('content')}
            />

            {/* Professional Input Status */}
            {(isSending || isTyping) && (
              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm">
                  <div className="relative">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <div className="absolute top-0 left-0 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" />
                  </div>
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                    {isSending ? 'Transmitting your message...' : 'AI Legal Assistant is analyzing...'}
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