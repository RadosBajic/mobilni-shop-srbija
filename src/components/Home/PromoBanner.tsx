
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { BannerService } from '@/services/BannerService';
import { BannerType } from '@/types/banners';

const PromoBanner: React.FC = () => {
  const { language } = useLanguage();
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoBanner = async () => {
      try {
        const promoBanners = await BannerService.getBanners('promo');
        if (promoBanners.length > 0) {
          setBanner(promoBanners[0]); // Get the first promo banner
        }
      } catch (error) {
        console.error('Failed to fetch promo banner:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoBanner();
  }, []);

  if (loading) {
    return (
      <div className="h-32 bg-muted/20 flex items-center justify-center my-16">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!banner) {
    return null; // Don't show anything if there's no promo banner
  }

  return (
    <div className="bg-muted/10 my-16 py-8">
      <div className="container">
        <div 
          className="rounded-lg overflow-hidden relative bg-cover bg-center h-48 md:h-64"
          style={{ backgroundImage: `url(${banner.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/20"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container px-4 md:px-6">
              <div className="max-w-xl text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  {banner.title[language]}
                </h3>
                <p className="mb-4 md:text-lg text-white/80">
                  {banner.description[language]}
                </p>
                <Button variant="secondary" asChild>
                  <Link to={banner.targetUrl}>
                    {language === 'sr' ? 'Saznaj više' : 'Learn More'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
