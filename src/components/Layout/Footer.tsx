
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground pt-12 pb-6 transition-theme">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <h3 className="text-xl font-bold mb-4">MobShop</h3>
            <p className="text-muted-foreground mb-4">
              {t('footerAbout') || 'Vaš pouzdani izvor opreme za mobilne telefone.'}
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('quickLinks') || 'Brzi linkovi'}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('products')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('contactUs') || 'Kontaktirajte nas'}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                <span>+381 11 123 4567</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                <span>info@mobshop.rs</span>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                <span>Bulevar kralja Aleksandra 73, Beograd</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t('newsletter') || 'Newsletter'}</h3>
            <p className="text-muted-foreground mb-4">
              {t('newsletterText') || 'Prijavite se na naš newsletter za najnovije ponude i akcije.'}
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder={t('emailAddress') || 'Email adresa'}
                className="flex-1 py-2 px-3 rounded-l-md border focus:outline-none focus:ring-1 focus:ring-primary dark:bg-secondary/70"
              />
              <button 
                type="submit" 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
              >
                {t('subscribe') || 'Prijavi se'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-border/60 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} MobShop. {t('allRightsReserved')}.
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
              {t('termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
