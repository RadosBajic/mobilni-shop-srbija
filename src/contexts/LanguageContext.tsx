
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define available languages
export type Language = 'sr' | 'en';

// Translation interface
export interface Translations {
  [key: string]: {
    sr: string;
    en: string;
  };
}

// Initial translations
export const translations: Translations = {
  // Navigation
  home: {
    sr: 'Početna',
    en: 'Home',
  },
  products: {
    sr: 'Proizvodi',
    en: 'Products',
  },
  categories: {
    sr: 'Kategorije',
    en: 'Categories',
  },
  about: {
    sr: 'O nama',
    en: 'About',
  },
  contact: {
    sr: 'Kontakt',
    en: 'Contact',
  },
  // Common
  search: {
    sr: 'Pretraga',
    en: 'Search',
  },
  cart: {
    sr: 'Korpa',
    en: 'Cart',
  },
  account: {
    sr: 'Nalog',
    en: 'Account',
  },
  login: {
    sr: 'Prijava',
    en: 'Login',
  },
  // Home page
  featuredProducts: {
    sr: 'Izdvojeni proizvodi',
    en: 'Featured Products',
  },
  newArrivals: {
    sr: 'Novo u ponudi',
    en: 'New Arrivals',
  },
  specialOffers: {
    sr: 'Specijalne ponude',
    en: 'Special Offers',
  },
  viewAll: {
    sr: 'Pogledaj sve',
    en: 'View All',
  },
  // Product related
  addToCart: {
    sr: 'Dodaj u korpu',
    en: 'Add to Cart',
  },
  price: {
    sr: 'Cena',
    en: 'Price',
  },
  // Cart related
  checkout: {
    sr: 'Plaćanje',
    en: 'Checkout',
  },
  emptyCart: {
    sr: 'Vaša korpa je prazna',
    en: 'Your cart is empty',
  },
  // Footer
  allRightsReserved: {
    sr: 'Sva prava zadržana',
    en: 'All rights reserved',
  },
  privacyPolicy: {
    sr: 'Politika privatnosti',
    en: 'Privacy Policy',
  },
  termsOfService: {
    sr: 'Uslovi korišćenja',
    en: 'Terms of Service',
  },
  // Theme toggle
  darkMode: {
    sr: 'Tamni režim',
    en: 'Dark Mode',
  },
  lightMode: {
    sr: 'Svetli režim',
    en: 'Light Mode',
  },
};

// Create context type
interface LanguageContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'sr',
  setLanguage: () => {},
  t: () => '',
});

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('sr');

  // Translation function
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
