
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSlider from '@/components/Home/HeroSlider';
import CategoryBanner from '@/components/Home/CategoryBanner';
import FeaturedProducts from '@/components/Home/FeaturedProducts';
import PromoBanner from '@/components/Home/PromoBanner';
import PromotionsGrid from '@/components/Home/PromotionsGrid';
import SaleBanner from '@/components/Home/SaleBanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, ShieldCheck, TruckIcon, Headphones, ArrowRight, Heart } from 'lucide-react';
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

  // Trenutni datum plus 7 dana kao krajnji datum akcije
  const saleEndDate = new Date();
  saleEndDate.setDate(saleEndDate.getDate() + 7);

  return (
    <>
      <SaleBanner discount={30} endDate={saleEndDate.toISOString()} />
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
        
        {/* Korisnički raving */}
        <div className="container py-16">
          <div className="bg-primary/5 rounded-xl p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {language === 'sr' ? 'Šta naši kupci kažu' : 'What Our Customers Say'}
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                {language === 'sr' 
                  ? 'Pogledajte iskustva naših zadovoljnih kupaca' 
                  : 'See what our satisfied customers have to say'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Marko P.',
                  comment: {
                    sr: 'Odlična usluga i brza dostava. Proizvod je upravo onakav kakav sam očekivao!',
                    en: 'Excellent service and fast delivery. The product is exactly what I expected!'
                  }
                },
                {
                  name: 'Ana S.',
                  comment: {
                    sr: 'Veoma sam zadovoljna kvalitetom. Definitivno ću ponovo kupovati ovde.',
                    en: 'I am very satisfied with the quality. I will definitely shop here again.'
                  }
                },
                {
                  name: 'Nikola M.',
                  comment: {
                    sr: 'Najpouzdanija online prodavnica mobilnih dodataka. Preporučujem!',
                    en: 'The most reliable online store for mobile accessories. I recommend it!'
                  }
                }
              ].map((review, index) => (
                <div key={index} className="bg-card p-6 rounded-lg shadow-sm">
                  <div className="flex items-center text-amber-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground">"{review.comment[language]}"</p>
                  <p className="font-medium text-sm">{review.name}</p>
                </div>
              ))}
            </div>
          </div>
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
    </>
  );
};

export default Index;
