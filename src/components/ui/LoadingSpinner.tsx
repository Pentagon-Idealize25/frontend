import React from 'react';
import {Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  message = 'Loading...'  
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
        <Loader className={`animate-spin text-black-500 ${sizes[size]}`}/>

      <span className="sr-only">{message}</span>
    </div>
  );
};

export default LoadingSpinner;