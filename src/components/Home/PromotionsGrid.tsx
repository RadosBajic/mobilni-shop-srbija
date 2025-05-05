
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PromotionType } from '@/types/banners';
import { BannerService } from '@/services/BannerService';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, Sparkles, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface PromotionsGridProps {
  position?: 'home' | 'category';
  limit?: number;
  className?: string;
}

const PromotionsGrid: React.FC<PromotionsGridProps> = ({
  position = 'home',
  limit = 4,
  className = ''
}) => {
  const { language } = useLanguage();
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const data = await BannerService.getPromotions(position);
        setPromotions(data.slice(0, limit));
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [position, limit]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className={`py-10 ${className}`}>
        <Skeleton className="h-10 w-3/12 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className={`py-10 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-primary">
        {language === 'sr' ? 'Aktuelne Promocije' : 'Current Promotions'}
      </h2>
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {promotions.map((promo) => (
          <motion.div key={promo.id} variants={item}>
            <Link 
              to={promo.targetUrl}
              className="group relative rounded-lg overflow-hidden h-64 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${promo.image})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {promo.discount && (
                <Badge className="absolute top-4 right-4 bg-accent text-white text-lg px-3 py-1.5 shadow-md flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  {promo.discount}% OFF
                </Badge>
              )}
              
              {promo.endDate && (
                <div className="absolute top-4 left-4 bg-black/60 text-white rounded-full px-3 py-1 text-xs flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {language === 'sr' ? 'Ograničeno vreme' : 'Limited time'}
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-xl font-bold text-white mb-2">
                  {promo.title[language]}
                </h3>
                <p className="text-white/80 mb-4 line-clamp-2">
                  {promo.description[language]}
                </p>
                <Button className="bg-white text-primary hover:bg-white/90 shadow-lg transition-transform group-hover:translate-y-[-4px]">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {language === 'sr' ? 'Pogledaj Ponudu' : 'View Offer'}
                </Button>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PromotionsGrid;
