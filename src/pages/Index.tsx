
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSlider from '@/components/Home/HeroSlider';
import CategoryBanner from '@/components/Home/CategoryBanner';
import FeaturedProducts from '@/components/Home/FeaturedProducts';
import PromoBanner from '@/components/Home/PromoBanner';
import PromotionsGrid from '@/components/Home/PromotionsGrid';
import SaleBanner from '@/components/Home/SaleBanner';
import WhatsNew from '@/components/Home/WhatsNew';
import FeatureBox, { Feature } from '@/components/Home/FeatureBox';
import Testimonials from '@/components/Home/Testimonials';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, TruckIcon, ShieldCheck, Headphones, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { siteConfig } from '@/lib/config';

const Index: React.FC = () => {
  const { language } = useLanguage();

  const features: Feature[] = [
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
      <MainLayout 
        fullWidth
        title={language === 'sr' ? 'Početna' : 'Home'}
        description={siteConfig.description[language]}
        keywords={siteConfig.keywords[language]}
      >
        {/* Hero slider */}
        <HeroSlider />
        
        {/* Features section */}
        <div className="container relative z-10 -mt-16">
          <FeatureBox features={features} />
        </div>
        
        {/* Category banners */}
        <div className="container mt-12">
          <h2 className="text-2xl font-bold mb-6 text-primary">
            {language === 'sr' ? 'Kategorije' : 'Categories'}
          </h2>
          <CategoryBanner />
        </div>
        
        {/* What's New section */}
        <WhatsNew />
        
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
        
        {/* Category-specific products - Added phone cases */}
        <div className="container">
          <FeaturedProducts 
            category="phone-cases"
            viewAllLink="/kategorija/phone-cases"
            title={language === 'sr' ? 'Maske za telefone' : 'Phone Cases'}
          />
        </div>
        
        {/* Testimonials */}
        <div className="container">
          <Testimonials />
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
