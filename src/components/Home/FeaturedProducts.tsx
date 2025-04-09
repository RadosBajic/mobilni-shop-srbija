
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/components/Products/ProductCard';
import ProductCard from '@/components/Products/ProductCard';
import PremiumProductCard from '@/components/Products/PremiumProductCard';
import { ProductService } from '@/services/ProductService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface FeaturedProductsProps {
  title?: string;
  viewAllLink?: string;
  premiumCards?: boolean;
  newArrivals?: boolean;
  limit?: number;
  className?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  viewAllLink = '/proizvodi',
  premiumCards = false,
  newArrivals = false,
  limit = 4,
  className = ''
}) => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let data: Product[];
        if (newArrivals) {
          data = await ProductService.getNewArrivals(limit);
        } else {
          data = await ProductService.getFeaturedProducts(limit);
        }
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [newArrivals, limit]);

  const defaultTitle = newArrivals 
    ? (language === 'sr' ? 'Nove Ponude' : 'New Arrivals')
    : (language === 'sr' ? 'Izdvojeni Proizvodi' : 'Featured Products');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`py-10 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">
          {title || defaultTitle}
        </h2>
        {viewAllLink && (
          <Link to={viewAllLink} className="flex items-center text-primary hover:underline text-sm font-medium group">
            {language === 'sr' ? 'Vidi sve' : 'View all'} 
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              {premiumCards ? (
                <PremiumProductCard product={product} />
              ) : (
                <ProductCard product={product} />
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-10 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">
            {language === 'sr' ? 'Nema dostupnih proizvoda.' : 'No products available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
