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
  // Admin panel
  dashboard: {
    sr: 'Kontrolna tabla',
    en: 'Dashboard',
  },
  orders: {
    sr: 'Porudžbine',
    en: 'Orders',
  },
  customers: {
    sr: 'Kupci',
    en: 'Customers',
  },
  banners: {
    sr: 'Baneri',
    en: 'Banners',
  },
  mail: {
    sr: 'Pošta',
    en: 'Mail',
  },
  importExport: {
    sr: 'Uvoz/Izvoz',
    en: 'Import/Export',
  },
  settings: {
    sr: 'Podešavanja',
    en: 'Settings',
  },
  analytics: {
    sr: 'Analitika',
    en: 'Analytics',
  },
  language: {
    sr: 'Jezik',
    en: 'Language',
  },
  logout: {
    sr: 'Odjava',
    en: 'Logout',
  },
  // Mail related
  compose: {
    sr: 'Napiši',
    en: 'Compose',
  },
  inbox: {
    sr: 'Primljeno',
    en: 'Inbox',
  },
  sent: {
    sr: 'Poslato',
    en: 'Sent',
  },
  drafts: {
    sr: 'Nacrti',
    en: 'Drafts',
  },
  trash: {
    sr: 'Otpad',
    en: 'Trash',
  },
  reply: {
    sr: 'Odgovori',
    en: 'Reply',
  },
  newMessage: {
    sr: 'Nova poruka',
    en: 'New Message',
  },
  to: {
    sr: 'Za',
    en: 'To',
  },
  subject: {
    sr: 'Tema',
    en: 'Subject',
  },
  send: {
    sr: 'Pošalji',
    en: 'Send',
  },
  cancel: {
    sr: 'Otkaži',
    en: 'Cancel',
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
