
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Slide {
  id: number;
  image: string;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  buttonText: {
    sr: string;
    en: string;
  };
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
    title: {
      sr: 'Nove premium maske za telefone',
      en: 'New Premium Phone Cases',
    },
    description: {
      sr: 'Zaštitite svoj uređaj sa našim najnovijim premium maskama',
      en: 'Protect your device with our latest premium cases',
    },
    buttonText: {
      sr: 'Pogledaj ponudu',
      en: 'Shop Now',
    },
    link: '/category/phone-cases',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1600&auto=format&fit=crop',
    title: {
      sr: 'Bežične slušalice',
      en: 'Wireless Earbuds',
    },
    description: {
      sr: 'Doživite vrhunski zvuk sa našim novim bežičnim slušalicama',
      en: 'Experience premium sound with our new wireless earbuds',
    },
    buttonText: {
      sr: 'Otkrij više',
      en: 'Discover More',
    },
    link: '/category/headphones',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1600&auto=format&fit=crop',
    title: {
      sr: 'Punjači i dodatna oprema',
      en: 'Chargers & Accessories',
    },
    description: {
      sr: 'Brzo punjenje i visok kvalitet za vaš uređaj',
      en: 'Fast charging and high quality for your device',
    },
    buttonText: {
      sr: 'Kupi odmah',
      en: 'Buy Now',
    },
    link: '/category/chargers',
  },
];

const HeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
                    <Link to={slide.link}>
                      {slide.buttonText[language]}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
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
    </div>
  );
};

export default HeroSlider;
