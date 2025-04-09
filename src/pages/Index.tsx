
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSlider from '@/components/Home/HeroSlider';
import CategoryBanner from '@/components/Home/CategoryBanner';
import FeaturedProducts from '@/components/Home/FeaturedProducts';
import PromoBanner from '@/components/Home/PromoBanner';
import PromotionsGrid from '@/components/Home/PromotionsGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, ShieldCheck, TruckIcon, Headphones, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { t, language } = useLanguage();

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
                  <h3 className="font-medium mb-1">{feature.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description[language]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Category banners */}
      <div className="container mt-12">
        <h2 className="text-2xl font-bold mb-6 text-primary">
          {language === 'sr' ? 'Kategorije' : 'Categories'}
        </h2>
        <CategoryBanner />
      </div>
      
      {/* Promotions grid */}
      <div className="container">
        <PromotionsGrid position="home" limit={2} />
      </div>
      
      {/* Featured products */}
      <div className="container">
        <FeaturedProducts 
          premiumCards={true} 
          title={language === 'sr' ? 'Izdvojene Ponude' : 'Featured Offers'}
        />
      </div>
      
      {/* Promo banner */}
      <PromoBanner />
      
      {/* New arrivals */}
      <div className="container">
        <FeaturedProducts 
          newArrivals={true}
          viewAllLink="/proizvodi?new=true" 
          title={language === 'sr' ? 'Novi Proizvodi' : 'New Arrivals'}
        />
      </div>
      
      {/* CTA Section */}
      <div className="container py-16">
        <div className="bg-primary/5 rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'sr' ? 'Spremni da kupujete?' : 'Ready to shop?'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {language === 'sr' 
              ? 'Pregledajte našu kompletnu kolekciju proizvoda i pronađite ono što vam je potrebno.' 
              : 'Browse our complete collection of products and find what you need.'}
          </p>
          <Button asChild size="lg" className="px-8">
            <Link to="/proizvodi" className="flex items-center">
              {language === 'sr' ? 'Svi proizvodi' : 'All Products'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
