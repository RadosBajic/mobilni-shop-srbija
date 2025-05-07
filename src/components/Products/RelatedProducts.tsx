
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronRight } from 'lucide-react';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/components/Products/ProductCard';
import EnhancedProductCard from '@/components/Products/EnhancedProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  productId: string;
  categoryId?: string;
  currentProductId?: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  productId, 
  categoryId,
  currentProductId,
  limit = 4 
}) => {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        // Use either productId or currentProductId (for backward compatibility)
        const id = currentProductId || productId;
        const data = await ProductService.getRelatedProducts(id, limit);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching related products:', error);
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Nije moguće učitati slične proizvode' 
            : 'Could not load related products',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, currentProductId, limit, language]);

  const title = language === 'sr' ? 'Slični proizvodi' : 'Related Products';

  if (products.length === 0 && !loading) {
    return null;
  }

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
    <div className="py-10 border-t border-border/40 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        <Link
          to="/proizvodi"
          className="flex items-center text-primary hover:underline text-sm font-medium group"
        >
          {language === 'sr' ? 'Vidi sve proizvode' : 'View all products'}
          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <EnhancedProductCard key={product.id} product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RelatedProducts;
