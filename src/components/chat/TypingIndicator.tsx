import { Loader, MessageCircle, Shield } from "lucide-react";
import { memo } from "react";
import { cn } from '@/lib/utils/utils';

const TypingIndicator = memo(() => (
  <div 
    className={cn(
      'flex group transition-all duration-300 justify-start'
    )}
  >
    <div className={cn(
      'flex max-w-[85%] lg:max-w-[75%] space-x-4'
    )}>
      {/* Enhanced Avatar - Same as AI message */}
      <div className="flex-shrink-0 mt-1">
        <div className={cn(
          'relative w-8 h-8 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl',
          'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600'
        )}>
          <MessageCircle className="w-4 h-4 text-white" />
          
          {/* Professional indicator for AI messages */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full">
            <Shield className="w-2 h-2 text-white absolute top-0 left-0" />
          </div>
        </div>
      </div>

      {/* Enhanced Message Content - Same styling as AI message */}
      <div className="flex flex-col space-y-1 min-w-0 h-fit">
        <div className={cn(
          'relative px-5 py-4 rounded-2xl transition-all duration-300',
          'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 rounded-bl-md text-slate-900 dark:text-white'
        )}>
          {/* Loader Content */}
          <div className="flex items-center gap-3 py-1">
            <Loader className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Thinking...
            </span>
          </div>
        </div>

        {/* Enhanced Timestamp - Similar to message timestamp */}
        <div className={cn(
          'text-xs font-medium text-slate-500 dark:text-slate-400 px-2 transition-opacity duration-300 text-left opacity-60'
        )}>
          <span className="tracking-wide">Analyzing your request</span>
        </div>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = "TypingIndicator";

export default TypingIndicator;
