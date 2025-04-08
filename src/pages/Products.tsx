
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, ChevronRight, ChevronDown, Star, Heart, ShoppingCart } from 'lucide-react';

// Mock products data
const mockProducts = [
  {
    id: 'p1',
    name: 'iPhone 14 Pro silikonska maska - crna',
    price: 2499,
    oldPrice: 2999,
    rating: 4.5,
    reviewCount: 28,
    image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=500&auto=format&fit=crop',
    category: 'Maske za telefone',
    tag: 'akcija',
    stock: 45,
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
    price: 1499,
    oldPrice: null,
    rating: 4.2,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=500&auto=format&fit=crop',
    category: 'Zaštita ekrana',
    tag: null,
    stock: 32,
  },
  {
    id: 'p3',
    name: 'Bežične Bluetooth slušalice sa mikrofonom',
    price: 4999,
    oldPrice: 5999,
    rating: 4.7,
    reviewCount: 36,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500&auto=format&fit=crop',
    category: 'Slušalice',
    tag: 'akcija',
    stock: 18,
  },
  {
    id: 'p4',
    name: 'Brzi punjač USB-C 65W',
    price: 3499,
    oldPrice: null,
    rating: 4.4,
    reviewCount: 15,
    image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?q=80&w=500&auto=format&fit=crop',
    category: 'Punjači',
    tag: 'novo',
    stock: 27,
  },
  {
    id: 'p5',
    name: 'Premium Lightning kabl - 2m',
    price: 1299,
    oldPrice: null,
    rating: 4.1,
    reviewCount: 22,
    image: 'https://images.unsplash.com/photo-1606292943133-cc1b0ff0e295?q=80&w=500&auto=format&fit=crop',
    category: 'Kablovi',
    tag: null,
    stock: 0,
  },
  {
    id: 'p6',
    name: 'Xiaomi Redmi Note 12 transparentna maska',
    price: 1199,
    oldPrice: 1499,
    rating: 4.3,
    reviewCount: 12,
    image: 'https://images.unsplash.com/photo-1609388449750-b504ef6d27f4?q=80&w=500&auto=format&fit=crop',
    category: 'Maske za telefone',
    tag: 'akcija',
    stock: 12,
  },
  {
    id: 'p7',
    name: 'Zaštitno staklo za Apple Watch',
    price: 1299,
    oldPrice: null,
    rating: 4.0,
    reviewCount: 8,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=500&auto=format&fit=crop',
    category: 'Zaštita ekrana',
    tag: null,
    stock: 20,
  },
  {
    id: 'p8',
    name: 'Bežični miš za laptop',
    price: 1999,
    oldPrice: 2499,
    rating: 4.6,
    reviewCount: 32,
    image: 'https://images.unsplash.com/photo-1629429407756-446d66abc6e9?q=80&w=500&auto=format&fit=crop',
    category: 'Računarska oprema',
    tag: 'akcija',
    stock: 15,
  },
];

// Categories
const categories = [
  { id: 'sve', name: 'Sve kategorije' },
  { id: 'maske', name: 'Maske za telefone' },
  { id: 'zastita', name: 'Zaštita ekrana' },
  { id: 'slusalice', name: 'Slušalice' },
  { id: 'punjaci', name: 'Punjači' },
  { id: 'kablovi', name: 'Kablovi' },
  { id: 'racunari', name: 'Računarska oprema' },
];

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [filterTag, setFilterTag] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('sve');
  
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const { toast } = useToast();

  // Filter products based on search, category, and tag
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'sve' || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const matchesTag = 
      filterTag === 'all' || 
      (filterTag === 'akcija' && product.tag === 'akcija') ||
      (filterTag === 'novo' && product.tag === 'novo') ||
      (filterTag === 'out-of-stock' && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesTag;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default: // popularity (by review count)
        return b.reviewCount - a.reviewCount;
    }
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Additional search logic would be implemented here in a real app
  };
  
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    toast({
      title: language === 'sr' ? 'Proizvod dodat u korpu' : 'Product added to cart',
      description: product.name,
    });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Početna</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground">Proizvodi</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <Card className="p-4 space-y-4 hover-lift transition-all">
              <h3 className="font-medium text-lg">Kategorije</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </Card>
            
            <Card className="p-4 space-y-4 hover-lift transition-all">
              <h3 className="font-medium text-lg">Filteri</h3>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="space-y-1">
                  <Button
                    variant={filterTag === 'all' ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFilterTag('all')}
                  >
                    Svi proizvodi
                  </Button>
                  <Button
                    variant={filterTag === 'akcija' ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFilterTag('akcija')}
                  >
                    Akcija
                  </Button>
                  <Button
                    variant={filterTag === 'novo' ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFilterTag('novo')}
                  >
                    Novo u ponudi
                  </Button>
                  <Button
                    variant={filterTag === 'out-of-stock' ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setFilterTag('out-of-stock')}
                  >
                    Nije na stanju
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium mb-2">Cena</h4>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    placeholder="min" 
                    className="w-full text-sm"
                  />
                  <span>-</span>
                  <Input 
                    type="number" 
                    placeholder="max" 
                    className="w-full text-sm"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filtering and sorting controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold">Proizvodi</h1>
              
              <div className="w-full sm:w-auto flex items-center gap-2">
                <form onSubmit={handleSearch} className="flex-1 sm:w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Pretraži proizvode..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </form>
                
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sortiraj po" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularnosti</SelectItem>
                    <SelectItem value="price-asc">Cena: rastuće</SelectItem>
                    <SelectItem value="price-desc">Cena: opadajuće</SelectItem>
                    <SelectItem value="rating">Oceni</SelectItem>
                    <SelectItem value="name">Nazivu</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" className="sm:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Results count */}
            <div className="text-sm text-muted-foreground mb-6">
              Prikazano {sortedProducts.length} proizvoda
            </div>
            
            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Link key={product.id} to={`/proizvod/${product.id}`}>
                  <Card className="overflow-hidden hover-lift group transition-all h-full flex flex-col">
                    <div className="relative">
                      <AspectRatio ratio={1 / 1}>
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="object-cover w-full transition-transform group-hover:scale-105"
                        />
                      </AspectRatio>
                      {product.tag && (
                        <Badge 
                          variant={product.tag === 'akcija' ? 'destructive' : 'default'}
                          className="absolute top-3 left-3"
                        >
                          {product.tag === 'akcija' ? 'Akcija' : 'Novo'}
                        </Badge>
                      )}
                      <Button 
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center text-amber-500 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>
                      
                      <h3 className="font-medium mb-2 flex-1 line-clamp-2">{product.name}</h3>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div>
                          <div className="font-bold text-lg">{product.price.toLocaleString()} RSD</div>
                          {product.oldPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {product.oldPrice.toLocaleString()} RSD
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {product.stock === 0 ? (
                            <Badge variant="outline" className="text-destructive">
                              Nije na stanju
                            </Badge>
                          ) : (
                            <>
                              <Badge variant="outline" className="text-primary">
                                Na stanju
                              </Badge>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Empty state */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Nema proizvoda</h3>
                <p className="text-muted-foreground mb-4">
                  Nismo pronašli proizvode koji odgovaraju traženim filterima.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setFilterTag('all');
                  setSelectedCategory('sve');
                }}>
                  Resetuj filtere
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
