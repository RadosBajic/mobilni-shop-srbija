
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const PromoBanner: React.FC = () => {
  const { language } = useLanguage();
  
  const title = {
    sr: 'Specijalna ponuda',
    en: 'Special Offer',
  };
  
  const subtitle = {
    sr: 'Popust do 30% na odabrane proizvode',
    en: 'Up to 30% off on selected products',
  };
  
  const description = {
    sr: 'Ograničeno vreme - ne propustite priliku da nabavite najbolju opremu po sjajnim cenama.',
    en: 'Limited time - don\'t miss the chance to get the best gear at great prices.',
  };
  
  const buttonText = {
    sr: 'Pogledaj ponudu',
    en: 'Shop Now',
  };
  
  return (
    <section className="py-12">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl">
          {/* Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1570891836654-d4961a7b6929?q=80&w=1200&auto=format&fit=crop)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60"></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 py-12 px-6 md:py-16 md:px-12 lg:px-16 text-white">
            <div className="max-w-xl">
              <h2 className="text-sm md:text-base uppercase tracking-wider mb-2">
                {title[language]}
              </h2>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {subtitle[language]}
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-lg">
                {description[language]}
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                <Link to="/promotions">
                  {buttonText[language]}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
