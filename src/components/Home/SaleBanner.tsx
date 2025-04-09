
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Percent, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SaleBannerProps {
  discount?: number;
  endDate?: string;
  className?: string;
}

const SaleBanner: React.FC<SaleBannerProps> = ({ 
  discount = 20,
  endDate,
  className = ''
}) => {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number} | null>(null);

  useEffect(() => {
    // Check if the banner was dismissed in the last 24 hours
    const dismissedTime = localStorage.getItem('saleBannerDismissed');
    if (dismissedTime) {
      const lastDismissed = parseInt(dismissedTime, 10);
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (lastDismissed > twentyFourHoursAgo) {
        setDismissed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [endDate]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('saleBannerDismissed', Date.now().toString());
  };

  if (dismissed) return null;

  return (
    <motion.div 
      className={`bg-accent text-white py-2 relative ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Percent className="h-4 w-4" />
          <p className="text-sm sm:text-base">
            {language === 'sr' 
              ? `Veliki popust: ${discount}% na sve proizvode` 
              : `Big Sale: ${discount}% off all products`}
            
            {timeLeft && (
              <span className="ml-2 hidden sm:inline-flex items-center text-xs font-medium">
                <Clock className="h-3 w-3 mr-1" />
                {language === 'sr' 
                  ? `Ističe za: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m` 
                  : `Ends in: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="text-xs sm:text-sm h-7 px-2 sm:px-3 bg-white text-accent hover:bg-white/90"
            asChild
          >
            <Link to="/proizvodi">
              {language === 'sr' ? 'Pogledaj ponudu' : 'Shop now'}
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-white hover:bg-accent/80 hover:text-white"
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SaleBanner;
