
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
  | 'thisCannotBeUndone'
  | 'footerAbout'
  | 'quickLinks'
  | 'about'
  | 'contactUs'
  | 'newsletter'
  | 'newsletterText'
  | 'emailAddress'
  | 'subscribe'
  | 'allRightsReserved'
  | 'privacyPolicy'
  | 'termsOfService'
  | 'viewAll'
  | 'noResults'
  | 'product'
  | 'category'
  | 'pages'
  | 'page'
  | 'compose'
  | 'cashOnDelivery'
  | 'cashOnDeliveryInfo'
  | 'orderSuccess'
  | 'orderSuccessMessage'
  | 'orderDetails'
  | 'customerInfo'
  | 'orderId'
  | 'orderDate'
  | 'orderStatus'
  | 'orderAmount'
  | 'orderItems'
  | 'shipping'
  | 'name'
  | 'price'
  | 'status'
  | 'actions'
  | 'edit'
  | 'delete'
  | 'save'
  | 'personalInfo'
  | 'address'
  | 'city'
  | 'postalCode'
  | 'country'
  | 'phone'
  | 'fullName';

type Translations = {
  [key in TranslationKey]: {
    sr: string;
    en: string;
  };
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
  // Additional translations for Footer
  footerAbout: {
    sr: 'Vaš pouzdani izvor opreme za mobilne telefone.',
    en: 'Your reliable source for mobile phone accessories.',
  },
  quickLinks: {
    sr: 'Brzi linkovi',
    en: 'Quick Links',
  },
  about: {
    sr: 'O nama',
    en: 'About',
  },
  contactUs: {
    sr: 'Kontaktirajte nas',
    en: 'Contact Us',
  },
  newsletter: {
    sr: 'Bilten',
    en: 'Newsletter',
  },
  newsletterText: {
    sr: 'Prijavite se na naš newsletter za najnovije ponude i akcije.',
    en: 'Subscribe to our newsletter for the latest offers and promotions.',
  },
  emailAddress: {
    sr: 'Email adresa',
    en: 'Email address',
  },
  subscribe: {
    sr: 'Prijavi se',
    en: 'Subscribe',
  },
  allRightsReserved: {
    sr: 'Sva prava zadržana',
    en: 'All Rights Reserved',
  },
  privacyPolicy: {
    sr: 'Politika privatnosti',
    en: 'Privacy Policy',
  },
  termsOfService: {
    sr: 'Uslovi korišćenja',
    en: 'Terms of Service',
  },
  // Additional translations for Header
  viewAll: {
    sr: 'Pogledaj sve',
    en: 'View All',
  },
  // Additional translations for Search
  noResults: {
    sr: 'Nema rezultata',
    en: 'No Results',
  },
  product: {
    sr: 'Proizvod',
    en: 'Product',
  },
  category: {
    sr: 'Kategorija',
    en: 'Category',
  },
  pages: {
    sr: 'Stranice',
    en: 'Pages',
  },
  page: {
    sr: 'Stranica',
    en: 'Page',
  },
  // Additional translations for Admin
  compose: {
    sr: 'Sastavi',
    en: 'Compose',
  },
  // Additional translations for order management
  cashOnDelivery: {
    sr: 'Plaćanje pouzećem',
    en: 'Cash on delivery',
  },
  cashOnDeliveryInfo: {
    sr: 'Platite kuriru prilikom preuzimanja pošiljke',
    en: 'Pay the courier when you receive your package',
  },
  orderSuccess: {
    sr: 'Porudžbina uspešna',
    en: 'Order Successful',
  },
  orderSuccessMessage: {
    sr: 'Vaša porudžbina je uspešno primljena. Uskoro ćete dobiti email sa potvrdom.',
    en: 'Your order has been successfully placed. You will receive a confirmation email shortly.',
  },
  orderDetails: {
    sr: 'Detalji porudžbine',
    en: 'Order Details',
  },
  customerInfo: {
    sr: 'Podaci o kupcu',
    en: 'Customer Information',
  },
  orderId: {
    sr: 'Broj porudžbine',
    en: 'Order ID',
  },
  orderDate: {
    sr: 'Datum porudžbine',
    en: 'Order Date',
  },
  orderStatus: {
    sr: 'Status porudžbine',
    en: 'Order Status',
  },
  orderAmount: {
    sr: 'Iznos porudžbine',
    en: 'Order Amount',
  },
  orderItems: {
    sr: 'Stavke porudžbine',
    en: 'Order Items',
  },
  shipping: {
    sr: 'Dostava',
    en: 'Shipping',
  },
  name: {
    sr: 'Ime',
    en: 'Name',
  },
  price: {
    sr: 'Cena',
    en: 'Price',
  },
  status: {
    sr: 'Status',
    en: 'Status',
  },
  actions: {
    sr: 'Akcije',
    en: 'Actions',
  },
  edit: {
    sr: 'Izmeni',
    en: 'Edit',
  },
  delete: {
    sr: 'Obriši',
    en: 'Delete',
  },
  save: {
    sr: 'Sačuvaj',
    en: 'Save',
  },
  personalInfo: {
    sr: 'Lični podaci',
    en: 'Personal Information',
  },
  address: {
    sr: 'Adresa',
    en: 'Address',
  },
  city: {
    sr: 'Grad',
    en: 'City',
  },
  postalCode: {
    sr: 'Poštanski broj',
    en: 'Postal code',
  },
  country: {
    sr: 'Država',
    en: 'Country',
  },
  phone: {
    sr: 'Telefon',
    en: 'Phone',
  },
  fullName: {
    sr: 'Ime i prezime',
    en: 'Full name',
  },
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKey) => string;
  translations: Translations;
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
