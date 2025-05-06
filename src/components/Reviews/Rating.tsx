
import React from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  className,
  readOnly = true,
  onChange,
  showValue = false,
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
      <div className="flex">
        {Array.from({ length: max }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'text-yellow-400 relative',
              !readOnly && 'cursor-pointer hover:scale-110 transition-transform',
            )}
            onClick={() => handleClick(index)}
          >
            {/* Background star (empty) */}
            <Star
              className={cn(
                sizeClasses[size],
                'stroke-yellow-400 text-muted fill-none'
              )}
            />
            
            {/* Foreground star (filled) */}
            <div 
              className="absolute top-0 left-0 overflow-hidden"
              style={{ 
                width: `${index < value 
                  ? (index + 1 <= value ? 100 : (value - index) * 100) 
                  : 0}%` 
              }}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'stroke-yellow-400 text-yellow-400 fill-current'
                )}
              />
            </div>
          </div>
        ))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
