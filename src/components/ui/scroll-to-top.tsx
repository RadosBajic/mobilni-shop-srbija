
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToTopProps {
  threshold?: number;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  offset?: number;
  showLabel?: boolean;
  label?: string;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ 
  threshold = 300,
  className,
  position = 'bottom-right',
  offset = 6,
  showLabel = false,
  label = 'Back to top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const positionClasses = {
    'bottom-right': `right-${offset}`,
    'bottom-left': `left-${offset}`,
    'bottom-center': 'left-1/2 transform -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed bottom-6 z-50",
            positionClasses[position]
          )}
        >
          <Button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            variant="default"
            size={showLabel ? "default" : "icon"}
            className={cn(
              'rounded-full shadow-lg bg-primary/80 backdrop-blur-sm hover:bg-primary/90',
              showLabel ? 'px-6' : '',
              className
            )}
          >
            <ChevronUp size={20} className={showLabel ? 'mr-2' : ''} />
            {showLabel && <span>{label}</span>}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
