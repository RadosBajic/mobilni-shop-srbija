
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define translation keys
type TranslationKey = 
  | 'home'
  | 'products'
  | 'aboutUs'
  | 'contact'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'login'
  | 'register'
  | 'myAccount'
  | 'logout'
  | 'dashboard'
  | 'orders'
  | 'categories'
  | 'settings'
  | 'importExport'
  | 'customers'
  | 'analytics'
  | 'banners'
  | 'mail'
  | 'language'
  | 'darkMode'
  | 'lightMode'
  | 'productUpdated'
  | 'productAdded'
  | 'productDeleted'
  | 'allCategories'
  | 'featured'
  | 'newArrivals'
  | 'onSale'
  | 'addToCart'
  | 'viewDetails'
  | 'outOfStock'
  | 'continueShopping'
  | 'placeOrder'
  | 'emptyCart'
  | 'totalPrice'
  | 'quantity'
  | 'removeFromCart'
  | 'shippingInfo'
  | 'paymentMethod'
  | 'orderSummary'
  | 'verifyHuman'
  | 'somethingWrong'
  | 'submit'
  | 'cancel'
  | 'confirmDelete'
  | 'areYouSure'
  | 'thisCannotBeUndone';

type Translations = {
  [key in TranslationKey]: {
    sr: string;
    en: string;
  };
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
  translations: Translations;
};

// Define translations
const translations: Translations = {
  home: {
    sr: 'Početna',
    en: 'Home',
  },
  products: {
    sr: 'Proizvodi',
    en: 'Products',
  },
  aboutUs: {
    sr: 'O nama',
    en: 'About Us',
  },
  contact: {
    sr: 'Kontakt',
    en: 'Contact',
  },
  search: {
    sr: 'Pretraga',
    en: 'Search',
  },
  cart: {
    sr: 'Korpa',
    en: 'Cart',
  },
  checkout: {
    sr: 'Plaćanje',
    en: 'Checkout',
  },
  login: {
    sr: 'Prijava',
    en: 'Login',
  },
  register: {
    sr: 'Registracija',
    en: 'Register',
  },
  myAccount: {
    sr: 'Moj nalog',
    en: 'My Account',
  },
  logout: {
    sr: 'Odjava',
    en: 'Logout',
  },
  dashboard: {
    sr: 'Kontrolna tabla',
    en: 'Dashboard',
  },
  orders: {
    sr: 'Porudžbine',
    en: 'Orders',
  },
  categories: {
    sr: 'Kategorije',
    en: 'Categories',
  },
  settings: {
    sr: 'Podešavanja',
    en: 'Settings',
  },
  importExport: {
    sr: 'Uvoz/Izvoz',
    en: 'Import/Export',
  },
  customers: {
    sr: 'Kupci',
    en: 'Customers',
  },
  analytics: {
    sr: 'Analitika',
    en: 'Analytics',
  },
  banners: {
    sr: 'Baneri',
    en: 'Banners',
  },
  mail: {
    sr: 'Mejl',
    en: 'Mail',
  },
  language: {
    sr: 'Jezik',
    en: 'Language',
  },
  darkMode: {
    sr: 'Tamni režim',
    en: 'Dark Mode',
  },
  lightMode: {
    sr: 'Svetli režim',
    en: 'Light Mode',
  },
  productUpdated: {
    sr: 'Proizvod ažuriran',
    en: 'Product Updated',
  },
  productAdded: {
    sr: 'Proizvod dodat',
    en: 'Product Added',
  },
  productDeleted: {
    sr: 'Proizvod obrisan',
    en: 'Product Deleted',
  },
  allCategories: {
    sr: 'Sve kategorije',
    en: 'All Categories',
  },
  featured: {
    sr: 'Istaknuto',
    en: 'Featured',
  },
  newArrivals: {
    sr: 'Novi proizvodi',
    en: 'New Arrivals',
  },
  onSale: {
    sr: 'Na akciji',
    en: 'On Sale',
  },
  addToCart: {
    sr: 'Dodaj u korpu',
    en: 'Add to Cart',
  },
  viewDetails: {
    sr: 'Pogledaj detalje',
    en: 'View Details',
  },
  outOfStock: {
    sr: 'Nema na stanju',
    en: 'Out of Stock',
  },
  continueShopping: {
    sr: 'Nastavi kupovinu',
    en: 'Continue Shopping',
  },
  placeOrder: {
    sr: 'Poruči',
    en: 'Place Order',
  },
  emptyCart: {
    sr: 'Prazna korpa',
    en: 'Empty Cart',
  },
  totalPrice: {
    sr: 'Ukupna cena',
    en: 'Total Price',
  },
  quantity: {
    sr: 'Količina',
    en: 'Quantity',
  },
  removeFromCart: {
    sr: 'Ukloni iz korpe',
    en: 'Remove from Cart',
  },
  shippingInfo: {
    sr: 'Informacije o dostavi',
    en: 'Shipping Information',
  },
  paymentMethod: {
    sr: 'Način plaćanja',
    en: 'Payment Method',
  },
  orderSummary: {
    sr: 'Pregled porudžbine',
    en: 'Order Summary',
  },
  verifyHuman: {
    sr: 'Potvrdi da si čovek',
    en: 'Verify you are human',
  },
  somethingWrong: {
    sr: 'Nešto je pošlo po zlu',
    en: 'Something went wrong',
  },
  submit: {
    sr: 'Pošalji',
    en: 'Submit',
  },
  cancel: {
    sr: 'Otkaži',
    en: 'Cancel',
  },
  confirmDelete: {
    sr: 'Potvrdi brisanje',
    en: 'Confirm Delete',
  },
  areYouSure: {
    sr: 'Da li ste sigurni?',
    en: 'Are you sure?',
  },
  thisCannotBeUndone: {
    sr: 'Ova akcija ne može biti poništena.',
    en: 'This action cannot be undone.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    // Try to get language from localStorage, fallback to browser language, then to 'en'
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) return savedLanguage;
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'sr' ? 'sr' : 'en';
  });

  // Translate function
  const t = (key: TranslationKey): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language as 'sr' | 'en'] || key;
  };

  // Update language and save to localStorage
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Update language in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document language for accessibility
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
