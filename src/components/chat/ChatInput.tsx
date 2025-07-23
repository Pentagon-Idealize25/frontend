// // ChatInput.tsx - Optimized Professional Version
// 'use client';

// import React, { useRef, useEffect, useCallback, memo } from 'react';
// import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
// import { Loader2, Send } from 'lucide-react';
// import { cn } from '@/lib/utils/utils';

// interface ChatInputProps<T extends FieldValues = FieldValues> {
//   name: Path<T>;
//   register: UseFormRegister<T>;
//   error?: string;
//   placeholder?: string;
//   onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
//   disabled?: boolean;
//   isSending?: boolean;
// }

// function ChatInputComponent<T extends FieldValues = FieldValues>({
//   name,
//   register,
//   error,
//   placeholder = 'Type a message...',
//   onKeyDown,
//   disabled = false,
//   isSending = false,
// }: ChatInputProps<T>) {
//   const textareaRef = useRef<HTMLTextAreaElement | null>(null);
//   const { ref, ...rest } = register(name);

//   const adjustHeight = useCallback(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
//     }
//   }, []);

//   useEffect(() => {
//     const el = textareaRef.current;
//     if (el) {
//       el.addEventListener('input', adjustHeight);
//       // Initial height adjustment
//       adjustHeight();
//       return () => el.removeEventListener('input', adjustHeight);
//     }
//   }, [adjustHeight]);

//   const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey && !disabled) {
//       e.preventDefault();
//       const form = e.currentTarget.closest('form');
//       if (form) {
//         form.requestSubmit();
//       }
//     }
//     onKeyDown?.(e);
//   }, [disabled, onKeyDown]);

//   const handleRef = useCallback((e: HTMLTextAreaElement | null) => {
//     ref(e);
//     textareaRef.current = e;
//   }, [ref]);

//   return (
//     <div className="space-y-2">
//       <div className="relative">
//         <div className={cn(
//           "flex items-end space-x-3 rounded-xl border transition-all duration-200",
//           "bg-white dark:bg-gray-900",
//           "border-gray-200 dark:border-gray-700",
//           "focus-within:border-gray-400 dark:focus-within:border-gray-500",
//           "focus-within:shadow-sm",
//           "hover:border-gray-300 dark:hover:border-gray-600",
//           error && "border-red-300 dark:border-red-600 focus-within:border-red-400"
//         )}>
//           {/* Text Input */}
//           <div className="flex-1 min-h-0">
//             <textarea
//               {...rest}
//               ref={handleRef}
//               className={cn(
//                 "w-full p-4 bg-transparent border-none resize-none focus:outline-none",
//                 "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
//                 "text-sm leading-relaxed",
//                 "scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
//               )}
//               placeholder={placeholder}
//               rows={1}
//               disabled={disabled}
//               onKeyDown={handleKeyDown}
//               aria-invalid={error ? 'true' : 'false'}
//               aria-describedby={error ? `${name}-error` : undefined}
//             />
//           </div>

//           {/* Send Button */}
//           <button
//             type="submit"
//             disabled={disabled || isSending}
//             className={cn(
//               "m-2 p-3 rounded-lg transition-all duration-200",
//               "bg-gradient-to-r from-gray-900 to-gray-700",
//               "dark:from-gray-100 dark:to-gray-300",
//               "text-white dark:text-gray-900",
//               "hover:from-gray-700 hover:to-gray-600",
//               "dark:hover:from-gray-200 dark:hover:to-gray-400",
//               "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
//               "dark:focus:ring-offset-gray-900",
//               "disabled:opacity-50 disabled:cursor-not-allowed",
//               "disabled:hover:from-gray-900 disabled:hover:to-gray-700",
//               "dark:disabled:hover:from-gray-100 dark:disabled:hover:to-gray-300",
//               "shadow-sm hover:shadow-md",
//               "transform hover:scale-[1.02] active:scale-[0.98]"
//             )}
//             aria-label={isSending ? 'Sending message...' : 'Send message'}
//           >
//             {isSending ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Send className="w-4 h-4" />
//             )}
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="animate-in slide-in-from-top-1 duration-200">
//           <p 
//             id={`${name}-error`}
//             className="text-red-500 dark:text-red-400 text-sm px-2 flex items-center space-x-1"
//             role="alert"
//           >
//             <span className="w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
//             <span>{error}</span>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// const ChatInput = memo(ChatInputComponent) as typeof ChatInputComponent;

// export default ChatInput;



// ChatInput.tsx - Professional Industrial Version
'use client';

import React, { useRef, useEffect, useCallback, memo } from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Loader2, Send, Paperclip, Mic } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface ChatInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  isSending?: boolean;
  maxLength?: number;
  showAttachments?: boolean;
  showVoiceInput?: boolean;
}

function ChatInputComponent<T extends FieldValues = FieldValues>({
  name,
  register,
  error,
  placeholder = 'Type your message...',
  onKeyDown,
  disabled = false,
  isSending = false,
  maxLength = 4000,
  showAttachments = false,
  showVoiceInput = false,
}: ChatInputProps<T>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register(name);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '44px'; // Reset to min height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const handleInput = () => adjustHeight();
      textarea.addEventListener('input', handleInput);
      adjustHeight(); // Initial adjustment
      return () => textarea.removeEventListener('input', handleInput);
    }
  }, [adjustHeight]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        const submitEvent = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(submitEvent);
      }
    }
    onKeyDown?.(e);
  }, [disabled, onKeyDown]);

  const handleRef = useCallback((element: HTMLTextAreaElement | null) => {
    ref(element);
    textareaRef.current = element;
  }, [ref]);

  const currentLength = textareaRef.current?.value.length || 0;
  const isNearLimit = currentLength > maxLength * 0.8;

  return (
    <div className="w-full space-y-3 animate-in fade-in-0 duration-300">
      {/* Main Input Container */}
      <div className={cn(
        "relative flex items-end gap-3 p-4 rounded-2xl transition-all duration-300 ease-out",
        "bg-white dark:bg-slate-800",
        "border-2 border-slate-200 dark:border-slate-600",
        "shadow-sm hover:shadow-md",
        "focus-within:border-blue-500 dark:focus-within:border-blue-400",
        "focus-within:shadow-lg focus-within:shadow-blue-500/10",
        error && "border-red-400 dark:border-red-500 focus-within:border-red-500",
        disabled && "opacity-60 cursor-not-allowed"
      )}>
        
        {/* Attachment Button */}
        {showAttachments && (
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200",
              "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              "hover:bg-slate-100 dark:hover:bg-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        )}

        {/* Text Input */}
        <div className="flex-1 min-h-0 relative">
          <textarea
            {...rest}
            ref={handleRef}
            className={cn(
              "w-full min-h-[44px] max-h-[160px] py-2.5 px-0 bg-transparent resize-none",
              "text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400",
              "text-sm leading-6 font-medium",
              "border-none outline-none focus:outline-none",
              "scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent",
              disabled && "cursor-not-allowed"
            )}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${name}-error` : undefined}
          />
          
          {/* Character Counter */}
          {isNearLimit && (
            <div className={cn(
              "absolute -bottom-6 right-0 text-xs font-medium transition-colors",
              currentLength >= maxLength 
                ? "text-red-500 dark:text-red-400" 
                : "text-amber-500 dark:text-amber-400"
            )}>
              {currentLength}/{maxLength}
            </div>
          )}
        </div>

        {/* Voice Input Button */}
        {showVoiceInput && (
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200",
              "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              "hover:bg-slate-100 dark:hover:bg-slate-700",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || isSending}
          className={cn(
            "flex-shrink-0 p-3 rounded-xl transition-all duration-200",
            "bg-gradient-to-r from-blue-600 to-blue-700",
            "hover:from-blue-700 hover:to-blue-800",
            "text-white shadow-lg hover:shadow-xl",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
            "transform hover:scale-105 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100",
            "group"
          )}
          aria-label={isSending ? 'Sending message...' : 'Send message'}
        >
          <div className="relative">
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            )}
          </div>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
            <p 
              id={`${name}-error`}
              className="text-red-700 dark:text-red-300 text-sm font-medium"
              role="alert"
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Input Guidelines */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Press Enter to send, Shift + Enter for new line</span>
        {!isNearLimit && (
          <span className="hidden sm:block">
            {maxLength - currentLength} characters remaining
          </span>
        )}
      </div>
    </div>
  );
}

const ChatInput = memo(ChatInputComponent) as typeof ChatInputComponent;

export default ChatInput;