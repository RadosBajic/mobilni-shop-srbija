
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface Category {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  image: string;
  description: {
    sr: string;
    en: string;
  };
}

// Sample categories data
const categories: Category[] = [
  {
    id: 'phone-cases',
    title: {
      sr: 'Maske za telefone',
      en: 'Phone Cases',
    },
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=600&auto=format&fit=crop',
    description: {
      sr: 'Zaštitite svoj uređaj stilom',
      en: 'Protect your device with style',
    },
  },
  {
    id: 'headphones',
    title: {
      sr: 'Slušalice',
      en: 'Headphones',
    },
    image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=600&auto=format&fit=crop',
    description: {
      sr: 'Vrhunski zvuk gde god da ste',
      en: 'Premium sound wherever you are',
    },
  },
  {
    id: 'chargers',
    title: {
      sr: 'Punjači',
      en: 'Chargers',
    },
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=600&auto=format&fit=crop',
    description: {
      sr: 'Brzo i efikasno punjenje',
      en: 'Fast and efficient charging',
    },
  },
];

const CategoryBanner: React.FC = () => {
  const { language } = useLanguage();
  
  return (
    <section className="py-12 bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-lg shadow-md h-60 block"
            >
              {/* Background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-colors"></div>
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {category.title[language]}
                </h3>
                <p className="text-white/80">
                  {category.description[language]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;
