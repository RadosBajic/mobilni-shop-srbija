
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const WhatsNew = () => {
  const { language } = useLanguage();

  const newsItems = [
    {
      id: 1,
      title: {
        sr: 'Nova kolekcija zaštitnih maski za telefone',
        en: 'New collection of phone cases',
      },
      description: {
        sr: 'Pogledajte našu najnoviju kolekciju zaštitnih maski za sve modele telefona.',
        en: 'Check out our latest collection of protective cases for all phone models.',
      },
      image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=500',
      link: '/kategorija/phone-cases',
    },
    {
      id: 2,
      title: {
        sr: 'Besplatna dostava za sve porudžbine',
        en: 'Free shipping for all orders',
      },
      description: {
        sr: 'Uživajte u besplatnoj dostavi za sve porudžbine preko 2000 RSD.',
        en: 'Enjoy free shipping for all orders over €20.',
      },
      image: 'https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?q=80&w=500',
      link: '/about#shipping',
    },
    {
      id: 3,
      title: {
        sr: 'Popusti na punjače i adaptere',
        en: 'Discounts on chargers and adapters',
      },
      description: {
        sr: 'Iskoristite naše specijalne ponude za punjače i adaptere svih vrsta.',
        en: 'Take advantage of our special offers for chargers and adapters of all types.',
      },
      image: 'https://images.unsplash.com/photo-1608064630409-2d89d7dee3cf?q=80&w=500',
      link: '/kategorija/chargers',
    },
  ];

  return (
    <div className="py-12">
      <div className="container px-4">
        <h2 className="text-2xl font-bold mb-8 text-primary">
          {language === 'sr' ? 'Šta je novo' : "What's New"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title[language]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2">{item.title[language]}</h3>
                <p className="text-muted-foreground mb-4">{item.description[language]}</p>
                <Link 
                  to={item.link}
                  className="inline-flex items-center text-primary hover:underline font-medium"
                >
                  {language === 'sr' ? 'Saznaj više' : 'Learn more'} 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
