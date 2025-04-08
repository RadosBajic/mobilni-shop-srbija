
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { BannerService } from '@/services/BannerService';
import { BannerType } from '@/types/banners';

const HeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const heroBanners = await BannerService.getBanners('hero');
        setSlides(heroBanners);
      } catch (error) {
        console.error('Failed to fetch hero banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, currentSlide]);

  if (loading) {
    return (
      <div className="h-[400px] md:h-[500px] bg-muted/20 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Don't show anything if there are no banners
  }

  return (
    <div className="relative overflow-hidden h-[400px] md:h-[500px]">
      {/* Slides */}
      <div className="h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl text-white animate-fade-in">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                    {slide.title[language]}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 text-white/80">
                    {slide.description[language]}
                  </p>
                  <Button asChild className="bg-accent hover:bg-accent/90 text-white">
                    <Link to={slide.targetUrl}>
                      {language === 'sr' ? 'Saznaj više' : 'Learn More'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons - only show if there are multiple slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
