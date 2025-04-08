
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft } from 'lucide-react';

const Checkout: React.FC = () => {
  const { language } = useLanguage();
  const { totalItems, totalPrice } = useCart();
  
  const translations = {
    checkout: {
      sr: 'Plaćanje',
      en: 'Checkout',
    },
    backToCart: {
      sr: 'Nazad na korpu',
      en: 'Back to cart',
    },
    underDevelopment: {
      sr: 'Stranica za plaćanje je u izradi',
      en: 'Checkout page is under development',
    },
    itemsInCart: {
      sr: 'artikala u korpi',
      en: 'items in cart',
    },
    total: {
      sr: 'Ukupno:',
      en: 'Total:',
    },
    currency: {
      sr: 'RSD',
      en: 'RSD',
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-8">
          <h1 className="text-3xl font-bold">{translations.checkout[language]}</h1>
          
          <div className="bg-card border rounded-lg shadow-sm p-6 max-w-md w-full">
            <p className="text-xl mb-6">{translations.underDevelopment[language]}</p>
            
            <div className="text-left space-y-3 mb-6">
              <div className="text-muted-foreground">
                {totalItems} {translations.itemsInCart[language]}
              </div>
              <div className="text-2xl font-bold">
                {translations.total[language]} {totalPrice.toLocaleString()} {translations.currency[language]}
              </div>
            </div>
            
            <Button asChild className="w-full">
              <Link to="/cart" className="flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {translations.backToCart[language]}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
