
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  isActive,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-5 text-xs px-1.5',
    md: 'h-6 text-sm px-2',
    lg: 'h-7 text-md px-2.5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full',
        sizeClasses[size],
        isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-gray-50 text-gray-500 border border-gray-200',
        className
      )}
    >
      <span
        className={cn(
          'mr-1.5 inline-block rounded-full w-2 h-2',
          isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        )}
      />
      <span className="font-medium leading-none">
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default StatusBadge;
