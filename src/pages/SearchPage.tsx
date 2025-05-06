
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/components/Products/ProductCard';
import ProductCard from '@/components/Products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchPage = () => {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      // Use the product service to search products
      const results = await ProductService.searchProducts(query);
      setProducts(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'sr' ? 'Pretraga proizvoda' : 'Product Search'}
        </h1>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === 'sr' ? 'Unesite pojam za pretragu...' : 'Enter search term...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              {language === 'sr' ? 'Pretraži' : 'Search'}
            </Button>
          </div>
        </form>

        {/* Search results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {searchParams.has('q') && (
              <div className="mb-4">
                <p className="text-muted-foreground">
                  {language === 'sr' 
                    ? `Rezultati pretrage za "${searchParams.get('q')}": ${products.length} proizvoda` 
                    : `Search results for "${searchParams.get('q')}": ${products.length} products`}
                </p>
              </div>
            )}

            {products.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : searchParams.has('q') ? (
              <div className="text-center py-16">
                <h3 className="text-lg font-medium mb-2">
                  {language === 'sr' ? 'Nema pronađenih proizvoda' : 'No products found'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'sr' 
                    ? 'Pokušajte sa drugim pojmovima za pretragu' 
                    : 'Try different search terms'}
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
