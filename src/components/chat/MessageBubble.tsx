// // MessageBubble.tsx - Optimized Professional Version
// 'use client';

// import { format } from 'date-fns';
// import { cn } from '@/lib/utils/utils';
// import { MessageCircle, User, Copy, Check } from 'lucide-react';
// import { useState, useCallback, memo } from 'react';
// import { formatText } from '@/lib/utils/formatBiography';

// interface MessageBubbleProps {
//   message: {
//     id: string;
//     content: string;
//     role: 'user' | 'assistant';
//     created_at: string;
//   };
// }

// const MessageBubble = memo(({ message }: MessageBubbleProps) => {
//   const isOwnMessage = message.role === 'user';
//   const [showActions, setShowActions] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
  
//   const copyToClipboard = useCallback(async () => {
//     try {
//       await navigator.clipboard.writeText(message.content);
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 2000);
//     } catch (err) {
//       console.error('Failed to copy:', err);
//     }
//   }, [message.content]);

//   const handleMouseEnter = useCallback(() => setShowActions(true), []);
//   const handleMouseLeave = useCallback(() => setShowActions(false), []);

//   return (
//     <div 
//       className={cn('flex group', isOwnMessage ? 'justify-end' : 'justify-start')}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <div className={cn('flex max-w-[80%] space-x-3', isOwnMessage ? 'flex-row-reverse space-x-reverse' : '')}>
//         {/* Avatar */}
//         <div className="flex-shrink-0 mt-1">
//           <div className={cn(
//             'w-6 h-6 rounded-full flex items-center justify-center',
//             isOwnMessage 
//               ? 'bg-gray-200 dark:bg-gray-700' 
//               : 'bg-gray-900 dark:bg-white'
//           )}>
//             {isOwnMessage ? (
//               <User className="w-3 h-3 text-gray-600 dark:text-gray-300" />
//             ) : (
//               <MessageCircle className="w-3 h-3 text-white dark:text-gray-900" />
//             )}
//           </div>
//         </div>

//         {/* Message Content */}
//         <div className="flex flex-col space-y-1">
//           <div className={cn(
//             'relative px-4 py-3 rounded-lg max-w-none',
//             isOwnMessage 
//               ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-br-sm' 
//               : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-sm shadow-sm'
//           )}>
//             <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
//               {formatText(message.content)}
//             </div>

//             {/* Copy Button */}
//             {!isOwnMessage && (
//               <button
//                 onClick={copyToClipboard}
//                 className={cn(
//                   'absolute -right-10 top-1/2 transform -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200',
//                   showActions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
//                 )}
//                 title={isCopied ? 'Copied!' : 'Copy message'}
//                 aria-label={isCopied ? 'Message copied' : 'Copy message to clipboard'}
//               >
//                 {isCopied ? (
//                   <Check className="w-3 h-3 text-green-500" />
//                 ) : (
//                   <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
//                 )}
//               </button>
//             )}
//           </div>

//           {/* Timestamp */}
//           <div className={cn(
//             'text-xs text-gray-400 dark:text-gray-500 px-1',
//             isOwnMessage ? 'text-right' : 'text-left'
//           )}>
//             {format(new Date(message.created_at), 'h:mm a')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// MessageBubble.displayName = 'MessageBubble';

// export default MessageBubble;


// MessageBubble.tsx - Professional Industrial Version
'use client';

import { format } from 'date-fns';
import { cn } from '@/lib/utils/utils';
import { MessageCircle, User, Copy, Check, Shield } from 'lucide-react';
import { useState, useCallback, memo, useMemo } from 'react';
import { formatText } from '@/lib/utils/formatBiography';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
    isTemporary?: boolean;
  };
  className?: string;
}

const MessageBubble = memo(({ message, className }: MessageBubbleProps) => {
  const isOwnMessage = message.role === 'user';
  const [showActions, setShowActions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Memoize formatted content
  const formattedContent = useMemo(() => formatText(message.content), [message.content]);
  
  // Memoize timestamp
  const formattedTime = useMemo(() => 
    format(new Date(message.created_at), 'h:mm a'), 
    [message.created_at]
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [message.content]);

  const handleMouseEnter = useCallback(() => setShowActions(true), []);
  const handleMouseLeave = useCallback(() => setShowActions(false), []);

  return (
    <div 
      className={cn(
        'flex group transition-all duration-300',
        isOwnMessage ? 'justify-end' : 'justify-start',
        message.isTemporary && 'opacity-70 scale-[0.98]',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={cn(
        'flex max-w-[85%] lg:max-w-[75%] space-x-4', 
        isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
      )}>
        {/* Enhanced Avatar */}
        <div className="flex-shrink-0 mt-1">
          <div className={cn(
            'relative w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl',
            isOwnMessage 
              ? 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600'
          )}>
            {isOwnMessage ? (
              <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <MessageCircle className="w-4 h-4 text-white" />
            )}
            
            {/* Professional indicator for AI messages */}
            {!isOwnMessage && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full">
                <Shield className="w-2 h-2 text-white absolute top-0 left-0" />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Message Content */}
        <div className="flex flex-col space-y-1 min-w-0 h-fit">
          <div className={cn(
            'relative px-5 py-2 rounded-2xl  transition-all duration-300 ',
            isOwnMessage 
              ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-br-md ' 
              : 'bg-gradient-to-br from-white to-slate-50 border  dark:border-slate-600 rounded-bl-md   '
          )}>
            {/* Content */}
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed font-medium py-1">
              {formattedContent}
            </div>

            {/* Enhanced Copy Button for AI messages */}
            {!isOwnMessage && (
              <button
                onClick={copyToClipboard}
                className={cn(
                  'absolute -right-12 top-1/2 transform -translate-y-1/2 p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:shadow-xl hover:scale-105',
                  showActions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
                )}
                title={isCopied ? 'Copied!' : 'Copy message'}
                aria-label={isCopied ? 'Message copied' : 'Copy message to clipboard'}
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                )}
              </button>
            )}

            {/* Message Status Indicator */}
            {message.isTemporary && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3">
                <div className="w-full h-full bg-amber-400 rounded-full animate-pulse opacity-75" />
              </div>
            )}
          </div>

          {/* Enhanced Timestamp */}
          <div className={cn(
            'text-xs font-medium text-slate-500 dark:text-slate-400 px-2 transition-opacity duration-300',
            isOwnMessage ? 'text-right' : 'text-left',
            showActions ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
          )}>
            <time dateTime={message.created_at} className="tracking-wide">
              {formattedTime}
            </time>
            {message.isTemporary && (
              <span className="ml-2 text-amber-500 text-2xs">• Sending</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;