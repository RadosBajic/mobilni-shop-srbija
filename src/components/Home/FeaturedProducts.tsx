
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard, { Product } from '../Products/ProductCard';

// Sample featured products data
const featuredProducts: Product[] = [
  {
    id: '1',
    title: {
      sr: 'iPhone 14 Pro silikonska maska - crna',
      en: 'iPhone 14 Pro Silicone Case - Black',
    },
    price: 2499,
    oldPrice: 2999,
    image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=400&auto=format&fit=crop',
    category: 'phone-cases',
    isOnSale: true,
  },
  {
    id: '2',
    title: {
      sr: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
      en: 'Samsung Galaxy S23 Ultra Glass Screen Protector',
    },
    price: 1499,
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=400&auto=format&fit=crop',
    category: 'screen-protectors',
  },
  {
    id: '3',
    title: {
      sr: 'Bežične Bluetooth slušalice sa mikrofonom',
      en: 'Wireless Bluetooth Earbuds with Microphone',
    },
    price: 4999,
    oldPrice: 5999,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=400&auto=format&fit=crop',
    category: 'headphones',
    isNew: true,
    isOnSale: true,
  },
  {
    id: '4',
    title: {
      sr: 'Brzi punjač USB-C 65W',
      en: 'Fast Charger USB-C 65W',
    },
    price: 3499,
    image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?q=80&w=400&auto=format&fit=crop',
    category: 'chargers',
    isNew: true,
  },
];

interface FeaturedProductsProps {
  title?: string;
  viewAllLink?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  title, 
  viewAllLink = '/products',
}) => {
  const { t } = useLanguage();
  
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {title || t('featuredProducts')}
          </h2>
          <Link 
            to={viewAllLink}
            className="flex items-center text-primary hover:underline font-medium"
          >
            {t('viewAll')}
            <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
