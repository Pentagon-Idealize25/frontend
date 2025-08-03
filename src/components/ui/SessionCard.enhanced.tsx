import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Edit, MessageCircle, Check, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils/utils';
import { memo, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { updateSessionTitle, deleteSession } from '@/lib/api/sessions';
import { toast } from 'sonner';

interface SessionCardProps {
  session: {
    id: string;
    title: string;
    created_at: string;
  };
  isActive: boolean;
  onClick: () => void;
  onSessionUpdated?: () => void; // Callback to refresh sessions list
  onSessionDeleted?: (sessionId: string) => void; // Callback when session is deleted
}

const SessionCard = memo(({ session, isActive, onClick, onSessionUpdated, onSessionDeleted }: SessionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(session.title);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(session.title);
  }, [session.title]);

  const handleSaveEdit = useCallback(async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!editTitle.trim() || editTitle === session.title) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    
    const updatePromise = updateSessionTitle(session.id, editTitle.trim());
    
    toast.promise(updatePromise, {
      loading: 'Updating session title...',
      success: 'Session title updated successfully!',
      error: (error: Error) => `Failed to update title: ${error.message}`,
    });

    try {
      await updatePromise;
      setIsEditing(false);
      onSessionUpdated?.(); // Refresh the sessions list
    } catch (error) {
      console.error('Failed to update session title:', error);
      // Error already handled by toast.promise
    } finally {
      setIsLoading(false);
    }
  }, [session.id, editTitle, session.title, onSessionUpdated]);

  const handleCancelEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(session.title);
  }, [session.title]);

  const handleDeleteConfirm = useCallback(async () => {
    console.log('Starting delete for session:', session.id);
    setIsLoading(true);
    setIsDeleteDialogOpen(false);
    
    const deletePromise = deleteSession(session.id);
    
    toast.promise(deletePromise, {
      loading: 'Deleting session...',
      success: 'Session deleted successfully!',
      error: (error: Error) => `Failed to delete session: ${error.message}`,
    });

    try {
      await deletePromise;
      console.log('Delete successful for session:', session.id);
      onSessionDeleted?.(session.id);
    } catch (error) {
      console.error('Failed to delete session:', error);
      // Error already handled by toast.promise
    } finally {
      setIsLoading(false);
    }
  }, [session.id, onSessionDeleted]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSaveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleCancelEdit(e as unknown as React.MouseEvent);
      }
    }
  }, [isEditing, handleSaveEdit, handleCancelEdit]);

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
          ? 'bg-gray-900  text-white border-gray-600 shadow-md' 
          : 'bg-white  hover:bg-slate-50  border-slate-200  hover:shadow-sm hover:border-slate-300 ',
        isEditing && 'cursor-default',
        isLoading && 'opacity-50 pointer-events-none'
      )}
      onClick={isEditing ? undefined : onClick}
      role="button"
      tabIndex={isEditing ? -1 : 0}
      onKeyDown={(e) => {
        if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
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
              ? 'bg-white/20' 
              : 'bg-gray-100'
          )}>
            <MessageCircle className={cn(
              'w-4 h-4',
              isActive 
                ? 'text-white' 
                : 'text-gray-600'
            )} />
          </div>

          {/* Session Info */}
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <Input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn(
                  'font-semibold text-sm h-8 border-0 border-b-2 rounded-none px-0 focus:ring-0 bg-transparent',
                  isActive 
                    ? 'text-white border-white/50 focus:border-white placeholder:text-white/70' 
                    : 'text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 placeholder:text-slate-500 dark:placeholder:text-slate-400'
                )}
                autoFocus
                disabled={isLoading}
                placeholder="Enter session title..."
              />
            ) : (
              <h3 className={cn(
                'font-medium text-sm truncate',
                isActive 
                  ? 'text-white' 
                  : 'text-slate-900 dark:text-white'
              )}>
                {session.title}
              </h3>
            )}
            <p className={cn(
              'text-xs mt-1.5',
              isActive 
                ? 'text-white/70' 
                : 'text-slate-500 dark:text-slate-400'
            )}>
              {formatDate(session.created_at)}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className={cn(
          'flex gap-1 transition-opacity duration-200 hover:opacity-100 ',
          isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
        )}>
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  'h-7 w-7',
                  isActive 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
                )}
                onClick={handleSaveEdit}
                disabled={isLoading}
                aria-label="Save changes"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  'h-7 w-7',
                  isActive 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
                )}
                onClick={handleCancelEdit}
                disabled={isLoading}
                aria-label="Cancel editing"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  'h-7 w-7',
                  isActive 
                    ? 'hover:bg-white/20 text-white' 
                    : 'hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
                )}
                onClick={handleEdit}
                disabled={isLoading}
                aria-label="Edit session"
              >
                <Edit className="h-3 w-3" />
              </Button>
              
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      'h-7 w-7',
                      isActive 
                        ? 'hover:bg-white/20' 
                        : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                    )}
                    disabled={isLoading}
                    aria-label="Delete session"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Delete Session
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Are you sure you want to delete this session? 
                      <br />
                      <br />
                      <strong className="text-slate-900 dark:text-slate-100">&ldquo;{session.title}&rdquo;</strong>
                      <br />
                      <br />
                      This will permanently delete the session and all associated messages. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteConfirm}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Session
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

SessionCard.displayName = 'SessionCard';

export default SessionCard;
