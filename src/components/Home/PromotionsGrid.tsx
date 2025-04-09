
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PromotionType } from '@/types/banners';
import { BannerService } from '@/services/BannerService';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart } from 'lucide-react';

interface PromotionsGridProps {
  position?: string;
  limit?: number;
}

const PromotionsGrid: React.FC<PromotionsGridProps> = ({
  position = 'home',
  limit = 4
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-64 bg-muted/20 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-6">
        {language === 'sr' ? 'Aktuelne Promocije' : 'Current Promotions'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <Link 
            key={promo.id} 
            to={promo.targetUrl}
            className="group relative rounded-lg overflow-hidden h-64"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${promo.image})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {promo.discount && (
              <Badge className="absolute top-4 right-4 bg-accent text-white text-lg px-3 py-1.5">
                {promo.discount}% OFF
              </Badge>
            )}
            
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-xl font-bold text-white mb-2">
                {promo.title[language]}
              </h3>
              <p className="text-white/80 mb-4 line-clamp-2">
                {promo.description[language]}
              </p>
              <Button className="bg-white text-primary hover:bg-white/90">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {language === 'sr' ? 'Pogledaj Ponudu' : 'View Offer'}
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PromotionsGrid;
