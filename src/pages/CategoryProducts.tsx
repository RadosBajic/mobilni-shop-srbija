
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SupabaseCategoryService } from '@/services/SupabaseCategoryService';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/components/Products/ProductCard';
import ProductCard from '@/components/Products/ProductCard';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const CategoryProducts = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const loadCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Load category data
        if (slug) {
          const categoryData = await SupabaseCategoryService.getCategoryBySlug(slug);
          setCategory(categoryData);

          // Load products for this category - passing as an object
          const productsData = await ProductService.getProducts({
            category: slug,
            limit: 100
          });
          
          // Apply sorting
          const sortedProducts = sortProducts(productsData, sortOption);
          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error('Error loading category or products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategoryAndProducts();
  }, [slug]);

  // Sort products when sort option changes
  useEffect(() => {
    setProducts(sortProducts(products, sortOption));
  }, [sortOption]);

  const sortProducts = (productsToSort: Product[], option: string) => {
    // Create a copy to avoid mutating the original array
    const sorted = [...productsToSort];
    
    switch (option) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return sorted.sort((a, b) => 
          a.title[language].localeCompare(b.title[language])
        );
      case 'name_desc':
        return sorted.sort((a, b) => 
          b.title[language].localeCompare(a.title[language])
        );
      case 'newest':
      default:
        // This would ideally use a timestamp, but for now we'll just return as is
        return sorted;
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{language === 'sr' ? 'Početna' : 'Home'}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/proizvodi">{language === 'sr' ? 'Proizvodi' : 'Products'}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-medium text-foreground">
              {category ? (language === 'sr' ? category.name.sr : category.name.en) : ''}
            </span>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {category ? (language === 'sr' ? category.name.sr : category.name.en) : ''}
        </h1>
        {category && category.description && (
          <p className="text-muted-foreground">
            {language === 'sr' ? category.description.sr : category.description.en}
          </p>
        )}
      </div>
      
      {/* Product Filters */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-muted-foreground">
          {language === 'sr' 
            ? `${products.length} proizvoda` 
            : `${products.length} products`}
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === 'sr' ? 'Sortiraj proizvode' : 'Sort products'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                {language === 'sr' ? 'Najnovije' : 'Newest'}
              </SelectItem>
              <SelectItem value="price_asc">
                {language === 'sr' ? 'Cena: rastuće' : 'Price: low to high'}
              </SelectItem>
              <SelectItem value="price_desc">
                {language === 'sr' ? 'Cena: opadajuće' : 'Price: high to low'}
              </SelectItem>
              <SelectItem value="name_asc">
                {language === 'sr' ? 'Naziv: A-Z' : 'Name: A-Z'}
              </SelectItem>
              <SelectItem value="name_desc">
                {language === 'sr' ? 'Naziv: Z-A' : 'Name: Z-A'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">
            {language === 'sr' ? 'Nema pronađenih proizvoda' : 'No products found'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === 'sr' 
              ? 'Proizvodi iz ove kategorije će uskoro biti dostupni' 
              : 'Products for this category will be available soon'}
          </p>
          <Button asChild>
            <Link to="/proizvodi">
              {language === 'sr' ? 'Pogledajte sve proizvode' : 'Browse all products'}
            </Link>
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default CategoryProducts;
