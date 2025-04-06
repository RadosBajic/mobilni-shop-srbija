
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import HeroSlider from '@/components/Home/HeroSlider';
import CategoryBanner from '@/components/Home/CategoryBanner';
import FeaturedProducts from '@/components/Home/FeaturedProducts';
import PromoBanner from '@/components/Home/PromoBanner';
import { useLanguage } from '@/contexts/LanguageContext';

const Index: React.FC = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      {/* Hero slider */}
      <HeroSlider />
      
      {/* Category banners */}
      <CategoryBanner />
      
      {/* Featured products */}
      <FeaturedProducts />
      
      {/* Promo banner */}
      <PromoBanner />
      
      {/* New arrivals */}
      <FeaturedProducts 
        title={t('newArrivals')} 
        viewAllLink="/new-arrivals" 
      />
    </MainLayout>
  );
};

export default Index;
