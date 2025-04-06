
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingCart, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CommandSearch from '@/components/Search/CommandSearch';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const categories = [
    { id: 'phone-cases', name: { sr: 'Maske za telefone', en: 'Phone Cases' } },
    { id: 'screen-protectors', name: { sr: 'Zaštita ekrana', en: 'Screen Protectors' } },
    { id: 'chargers', name: { sr: 'Punjači', en: 'Chargers' } },
    { id: 'cables', name: { sr: 'Kablovi', en: 'Cables' } },
    { id: 'headphones', name: { sr: 'Slušalice', en: 'Headphones' } },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'sr' ? 'en' : 'sr');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b transition-theme">
      <div className="container">
        {/* Top header with logo, search, and actions */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            MobShop
          </Link>

          {/* Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <CommandSearch />
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Cart button */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart">
                <ShoppingCart size={20} />
                <span className="sr-only">{t('cart')}</span>
              </Link>
            </Button>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span className="sr-only">{isDarkMode ? t('lightMode') : t('darkMode')}</span>
            </Button>

            {/* Language toggle */}
            <Button variant="ghost" onClick={toggleLanguage} className="text-sm font-medium">
              {language === 'sr' ? 'EN' : 'SR'}
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Main navigation - desktop */}
        <nav className="hidden md:flex items-center justify-between py-3">
          <div className="flex space-x-1">
            <Link to="/" className="nav-link">{t('home')}</Link>
            
            {/* Categories dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-link flex items-center">
                  {t('categories')}
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/category/${category.id}`}>
                      {category.name[language]}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link to="/categories">
                    <span className="font-medium text-primary">{t('viewAll')}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/products" className="nav-link">{t('products')}</Link>
            <Link to="/about" className="nav-link">{t('about')}</Link>
            <Link to="/contact" className="nav-link">{t('contact')}</Link>
          </div>
        </nav>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            {/* Mobile search */}
            <div className="mb-4">
              <CommandSearch />
            </div>

            {/* Mobile menu links */}
            <div className="flex flex-col space-y-2">
              <Link to="/" className="nav-link">{t('home')}</Link>
              <div className="py-2 px-3">
                <h3 className="font-medium mb-2">{t('categories')}</h3>
                <div className="pl-3 flex flex-col space-y-2 text-sm">
                  {categories.map((category) => (
                    <Link 
                      key={category.id}
                      to={`/category/${category.id}`}
                      className="nav-link"
                    >
                      {category.name[language]}
                    </Link>
                  ))}
                  <Link to="/categories" className="nav-link font-medium text-primary">
                    {t('viewAll')}
                  </Link>
                </div>
              </div>
              <Link to="/products" className="nav-link">{t('products')}</Link>
              <Link to="/about" className="nav-link">{t('about')}</Link>
              <Link to="/contact" className="nav-link">{t('contact')}</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
