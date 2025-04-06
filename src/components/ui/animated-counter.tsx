
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  formatter = (val) => val.toString()
}) => {
  const [count, setCount] = useState(0);
  const previousValueRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    previousValueRef.current = count;
    startTimeRef.current = null;

    const animation = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const progress = timestamp - startTimeRef.current;
      const progressRatio = Math.min(progress / duration, 1);
      
      // Use easing function for a more natural animation
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3); // Cubic ease-out
      
      const nextCount = Math.floor(
        previousValueRef.current + (value - previousValueRef.current) * easedProgress
      );
      
      setCount(nextCount);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(animation);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(animation);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, duration]);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}{formatter(count)}{suffix}
    </span>
  );
};
