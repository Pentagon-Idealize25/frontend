
'use client';

import React, { useRef, useEffect, useCallback, memo, useState } from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';
import { Loader2, Send, Paperclip, Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

interface ChatInputProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  placeholder?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFileSelect?: (files: FileList) => void;
  onVoiceToggle?: () => void;
  disabled?: boolean;
  isSending?: boolean;
  isVoiceRecording?: boolean;
  maxLength?: number;
  showAttachments?: boolean;
  showVoiceInput?: boolean;
  attachedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  value?: string; // For controlled input
}

function ChatInputComponent<T extends FieldValues = FieldValues>({
  name,
  register,
  error,
  placeholder = 'Type your message...',
  onKeyDown,
  onFileSelect,
  onVoiceToggle,
  disabled = false,
  isSending = false,
  isVoiceRecording = false,
  maxLength = 4000,
  showAttachments = false,
  showVoiceInput = false,
  attachedFiles = [],
  onRemoveFile,
  value,
}: ChatInputProps<T>) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { ref, onChange, ...rest } = register(name);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '40px'; // Smaller reset height
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 120); // Reduced max height
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

  // Adjust height when value changes externally
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

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

  const handleFileButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect?.(files);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  }, [onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect?.(files);
    }
  }, [onFileSelect]);

  const currentLength = value?.length || textareaRef.current?.value.length || 0;
  const isNearLimit = currentLength > maxLength * 0.8;
  const isOverLimit = currentLength >= maxLength;
  const isEmpty = currentLength === 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-2 animate-in fade-in-0 duration-300">
      {/* Attached Files */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {attachedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-32">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => onRemoveFile?.(index)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Container */}
      <div
        className={cn(
          "relative flex items-end gap-3 py-1 px-1 rounded-2xl transition-all duration-300 ease-out",
          "bg-white dark:bg-slate-800",
          "border-2 border-slate-200 dark:border-slate-600",
          "shadow-sm hover:shadow-md",
          "focus-within:border-blue-500 dark:focus-within:border-blue-400",
          "focus-within:shadow-lg focus-within:shadow-blue-500/10",
          error && "border-red-400 dark:border-red-500 focus-within:border-red-500",
          disabled && "opacity-60 cursor-not-allowed",
          isDragging && "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
        )}
        onDragOver={showAttachments ? handleDragOver : undefined}
        onDragLeave={showAttachments ? handleDragLeave : undefined}
        onDrop={showAttachments ? handleDrop : undefined}
      >
        
        {/* Attachment Button & Hidden File Input */}
        {showAttachments && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
            <button
              type="button"
              onClick={handleFileButtonClick}
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
          </>
        )}

        {/* Text Input */}
        <div className="flex-1 min-h-0 relative flex justify-center items-center">
          <textarea
            {...rest}
            ref={handleRef}
            onChange={(e) => {
              onChange(e);
              adjustHeight();
            }}
            className={cn(
              "w-full min-h-[40px] max-h-[120px] py-2 px-0 bg-transparent resize-none",
              "text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400",
              "text-sm leading-5 font-medium",
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
              "absolute -bottom-5 right-0 text-xs font-medium transition-colors",
              isOverLimit 
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
            onClick={onVoiceToggle}
            disabled={disabled}
            className={cn(
              "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isVoiceRecording
                ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
            aria-label={isVoiceRecording ? "Stop recording" : "Start voice input"}
          >
            <Mic className={cn("w-5 h-5", isVoiceRecording && "animate-pulse")} />
          </button>
        )}

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || isSending || isEmpty || isOverLimit}
          className={cn(
            "flex-shrink-0 p-2.5 rounded-xl transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
            "transform active:scale-95",
            "group",
            isEmpty || isOverLimit || disabled || isSending
              ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105"
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