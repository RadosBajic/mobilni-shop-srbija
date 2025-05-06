
import React from 'react';
import { cn } from '@/lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  className,
  readOnly = true,
  onChange,
}) => {
  // Define star sizes based on size prop
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const handleClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={cn('flex items-center', className)}>
      {Array.from({ length: max }).map((_, index) => (
        <Star 
          key={index}
          filled={index < value}
          className={cn(
            sizeClasses[size], 
            !readOnly && 'cursor-pointer hover:scale-110 transition-transform',
          )}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
};

interface StarProps {
  filled: boolean;
  className?: string;
  onClick?: () => void;
}

const Star: React.FC<StarProps> = ({ filled, className, onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'text-yellow-400',
        filled ? 'fill-yellow-400' : 'fill-transparent',
        className
      )}
      onClick={onClick}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
};

export default Rating;
