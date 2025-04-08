
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { BannerService } from '@/services/BannerService';
import { PromotionType } from '@/types/banners';

const CategoryBanner: React.FC = () => {
  const { language } = useLanguage();
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const homePromotions = await BannerService.getPromotions('home');
        setPromotions(homePromotions);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 bg-muted/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (promotions.length === 0) {
    return null; // Don't show anything if there are no promotions
  }

  return (
    <div className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promotion) => (
            <Link
              key={promotion.id}
              to={promotion.targetUrl}
              className="overflow-hidden rounded-lg relative group hover-lift"
            >
              <div 
                className="h-64 bg-cover bg-center transform transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${promotion.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {promotion.title[language]}
                  </h3>
                  <p className="text-white/80">
                    {promotion.description[language]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;
