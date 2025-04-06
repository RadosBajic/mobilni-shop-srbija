
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSlider from '@/components/Home/HeroSlider';
import CategoryBanner from '@/components/Home/CategoryBanner';
import FeaturedProducts from '@/components/Home/FeaturedProducts';
import PromoBanner from '@/components/Home/PromoBanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, ShieldCheck, TruckIcon, Headphones } from 'lucide-react';

const Index: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: TruckIcon,
      title: {
        sr: 'Brza dostava',
        en: 'Fast Delivery',
      },
      description: {
        sr: 'Dostava na teritoriji cele Srbije',
        en: 'Delivery throughout Serbia',
      },
    },
    {
      icon: ShieldCheck,
      title: {
        sr: 'Garancija kvaliteta',
        en: 'Quality Guarantee',
      },
      description: {
        sr: 'Svi proizvodi su proverenog kvaliteta',
        en: 'All products are of verified quality',
      },
    },
    {
      icon: Headphones,
      title: {
        sr: 'Korisnička podrška',
        en: 'Customer Support',
      },
      description: {
        sr: 'Dostupni smo svakog radnog dana',
        en: 'Available every working day',
      },
    },
    {
      icon: Cpu,
      title: {
        sr: 'Originalni delovi',
        en: 'Original Parts',
      },
      description: {
        sr: 'Garantovano originalni delovi i oprema',
        en: 'Guaranteed original parts and equipment',
      },
    },
  ];

  return (
    <MainLayout fullWidth>
      {/* Hero slider */}
      <HeroSlider />
      
      {/* Features section */}
      <div className="container relative z-10 -mt-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 flex items-start">
                <div className="rounded-full bg-primary/10 p-3 mr-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{feature.title[t.language]}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description[t.language]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Category banners */}
      <CategoryBanner />
      
      {/* Featured products */}
      <div className="container">
        <FeaturedProducts />
      </div>
      
      {/* Promo banner */}
      <PromoBanner />
      
      {/* New arrivals */}
      <div className="container">
        <FeaturedProducts 
          title={t('newArrivals')} 
          viewAllLink="/new-arrivals" 
        />
      </div>
    </MainLayout>
  );
};

export default Index;
