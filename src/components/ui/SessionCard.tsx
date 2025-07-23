import { Button } from '@/components/ui/button';
import { Trash2, Edit, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { memo, useCallback } from 'react';
import { format } from 'date-fns';

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    created_at: string;
  };
  isActive: boolean;
  onClick: () => void;
}

const SessionCard = memo(({ session, isActive, onClick }: SessionCardProps) => {
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement edit functionality
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement delete functionality
  }, []);

  const formatDate = useCallback((dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  }, []);

  return (
    <div 
      className={cn(
        'group relative p-4 rounded-lg cursor-pointer transition-all duration-200 border',
        isActive 
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white shadow-sm' 
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:shadow-sm'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Chat session: ${session.title}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          {/* Session Icon */}
          <div className={cn(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
            isActive 
              ? 'bg-white/20 dark:bg-gray-900/20' 
              : 'bg-gray-100 dark:bg-gray-700'
          )}>
            <MessageCircle className={cn(
              'w-4 h-4',
              isActive 
                ? 'text-white dark:text-gray-900' 
                : 'text-gray-600 dark:text-gray-300'
            )} />
          </div>

          {/* Session Info */}
          <div className="min-w-0 flex-1">
            <h3 className={cn(
              'font-semibold text-sm truncate',
              isActive 
                ? 'text-white dark:text-gray-900' 
                : 'text-gray-900 dark:text-white'
            )}>
              {session.title}
            </h3>
            <p className={cn(
              'text-xs mt-1',
              isActive 
                ? 'text-white/70 dark:text-gray-900/70' 
                : 'text-gray-500 dark:text-gray-400'
            )}>
              {formatDate(session.created_at)}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={cn(
          'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          isActive && 'opacity-100'
        )}>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              'h-7 w-7',
              isActive 
                ? 'hover:bg-white/20 dark:hover:bg-gray-900/20 text-white dark:text-gray-900' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
            )}
            onClick={handleEdit}
            aria-label="Edit session"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              'h-7 w-7',
              isActive 
                ? 'hover:bg-white/20 dark:hover:bg-gray-900/20' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'
            )}
            onClick={handleDelete}
            aria-label="Delete session"
          >
            <Trash2 className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
});

SessionCard.displayName = 'SessionCard';

export default SessionCard;