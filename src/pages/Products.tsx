import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Search, SlidersHorizontal, FilterX, Check } from 'lucide-react';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/components/Products/ProductCard';
import ProductCard from '@/components/Products/ProductCard';

const categories = [
  { id: 'phone-cases', nameSr: 'Maske za telefone', nameEn: 'Phone Cases' },
  { id: 'screen-protectors', nameSr: 'Zaštita ekrana', nameEn: 'Screen Protectors' },
  { id: 'headphones', nameSr: 'Slušalice', nameEn: 'Headphones' },
  { id: 'chargers', nameSr: 'Punjači', nameEn: 'Chargers' },
  { id: 'cables', nameSr: 'Kablovi', nameEn: 'Cables' },
  { id: 'adapters', nameSr: 'Adapteri', nameEn: 'Adapters' },
];

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'alphabetical';

const Products: React.FC = () => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Filter visibility on mobile
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fix: Pass an empty object as parameter to getProducts
        const allProducts = await ProductService.getProducts({});
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      let matches = true;
      
      // Search term filter
      if (searchTerm) {
        matches = product.title[language].toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // Category filter
      if (matches && selectedCategories.length > 0) {
        matches = selectedCategories.includes(product.category);
      }
      
      // New only filter
      if (matches && showNewOnly) {
        matches = !!product.isNew;
      }
      
      // Sale only filter
      if (matches && showSaleOnly) {
        matches = !!product.isOnSale;
      }
      
      return matches;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'alphabetical':
          return a.title[language].localeCompare(b.title[language]);
        case 'newest':
        default:
          // Assuming newer products have "isNew" flag
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
      }
    });
    
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setShowNewOnly(false);
    setShowSaleOnly(false);
    setSortBy('newest');
  };
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleQuickAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.title[language],
      price: product.price,
      image: product.image
    });
    
    toast({
      title: language === 'sr' ? 'Proizvod dodat u korpu' : 'Product added to cart',
      description: product.title[language],
    });
  };
  
  const translations = {
    products: {
      sr: 'Proizvodi',
      en: 'Products',
    },
    searchPlaceholder: {
      sr: 'Pretraži proizvode...',
      en: 'Search products...',
    },
    filters: {
      sr: 'Filteri',
      en: 'Filters',
    },
    categories: {
      sr: 'Kategorije',
      en: 'Categories',
    },
    productStatus: {
      sr: 'Status proizvoda',
      en: 'Product Status',
    },
    newProducts: {
      sr: 'Novi proizvodi',
      en: 'New Products',
    },
    onSale: {
      sr: 'Na akciji',
      en: 'On Sale',
    },
    sortBy: {
      sr: 'Sortiraj po',
      en: 'Sort by',
    },
    priceAsc: {
      sr: 'Cena (najniža prvo)',
      en: 'Price (lowest first)',
    },
    priceDesc: {
      sr: 'Cena (najviša prvo)',
      en: 'Price (highest first)',
    },
    newest: {
      sr: 'Najnovije',
      en: 'Newest',
    },
    alphabetical: {
      sr: 'A-Z',
      en: 'A-Z',
    },
    resetFilters: {
      sr: 'Resetuj filtere',
      en: 'Reset Filters',
    },
    noResults: {
      sr: 'Nema pronađenih proizvoda',
      en: 'No products found',
    },
    loading: {
      sr: 'Učitavanje proizvoda...',
      en: 'Loading products...',
    },
    showFilters: {
      sr: 'Prikaži filtere',
      en: 'Show Filters',
    },
    hideFilters: {
      sr: 'Sakrij filtere',
      en: 'Hide Filters',
    },
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">{translations.products[language]}</h1>
        
        {/* Search bar and filter toggle for mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={translations.searchPlaceholder[language]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="sm:hidden flex gap-2 items-center" 
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            {filtersVisible ? (
              <>
                <FilterX className="h-4 w-4" />
                {translations.hideFilters[language]}
              </>
            ) : (
              <>
                <SlidersHorizontal className="h-4 w-4" />
                {translations.showFilters[language]}
              </>
            )}
          </Button>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder={translations.sortBy[language]} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{translations.newest[language]}</SelectItem>
              <SelectItem value="price-asc">{translations.priceAsc[language]}</SelectItem>
              <SelectItem value="price-desc">{translations.priceDesc[language]}</SelectItem>
              <SelectItem value="alphabetical">{translations.alphabetical[language]}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className={`lg:block ${filtersVisible ? 'block' : 'hidden'}`}>
            <div className="sticky top-4 bg-card rounded-lg border border-border p-4 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">{translations.filters[language]}</h2>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-xs">
                  {translations.resetFilters[language]}
                </Button>
              </div>
              
              <Separator />
              
              {/* Categories */}
              <div>
                <Accordion type="single" collapsible defaultValue="categories">
                  <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="py-2">
                      {translations.categories[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${category.id}`} 
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryToggle(category.id)}
                            />
                            <label 
                              htmlFor={`category-${category.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {language === 'sr' ? category.nameSr : category.nameEn}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <Separator />
              
              {/* Product status */}
              <div>
                <Accordion type="single" collapsible defaultValue="status">
                  <AccordionItem value="status" className="border-none">
                    <AccordionTrigger className="py-2">
                      {translations.productStatus[language]}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="new-products" 
                            checked={showNewOnly}
                            onCheckedChange={(checked) => setShowNewOnly(!!checked)}
                          />
                          <label 
                            htmlFor="new-products"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {translations.newProducts[language]}
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="on-sale" 
                            checked={showSaleOnly}
                            onCheckedChange={(checked) => setShowSaleOnly(!!checked)}
                          />
                          <label 
                            htmlFor="on-sale"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {translations.onSale[language]}
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div 
                    key={index} 
                    className="bg-muted/20 rounded-lg h-80 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground mb-4">{translations.noResults[language]}</p>
                <Button variant="outline" onClick={resetFilters}>
                  {translations.resetFilters[language]}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
