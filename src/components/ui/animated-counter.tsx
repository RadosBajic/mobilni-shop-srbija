
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (value: number) => string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1500,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  formatter,
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      countRef.current = 0;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Easing function - easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        
        countRef.current = eased * value;
        setCount(countRef.current);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }
  }, [inView, value, duration]);

  const formattedCount = formatter 
    ? formatter(count)
    : count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span ref={ref} className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
};

export default AnimatedCounter;
