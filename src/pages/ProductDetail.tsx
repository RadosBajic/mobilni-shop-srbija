import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Heart, Share2, Star, ChevronRight, Minus, Plus } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock product data
const mockProduct = {
  id: 'p1',
  name: {
    sr: 'iPhone 14 Pro silikonska maska - crna',
    en: 'iPhone 14 Pro silicone case - black'
  },
  price: 2499,
  oldPrice: 2999,
  rating: 4.5,
  reviewCount: 28,
  images: [
    'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79a2?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=500&auto=format&fit=crop'
  ],
  category: {
    sr: 'Maske za telefone',
    en: 'Phone Cases'
  },
  brand: 'MobShop',
  compatibility: ['iPhone 14 Pro', 'iPhone 14 Pro Max'],
  colors: ['black', 'blue', 'red', 'green', 'transparent'],
  material: {
    sr: 'Silikon',
    en: 'Silicone'
  },
  description: {
    sr: 'Zaštitite vaš iPhone 14 Pro sa ovom premium silikonskom maskom. Pruža odličnu zaštitu od udaraca i ogrebotina, uz elegantan izgled. Maska je 100% kompatibilna sa bežičnim punjenjem.',
    en: 'Protect your iPhone 14 Pro with this premium silicone case. It provides excellent protection against impacts and scratches while maintaining an elegant look. The case is 100% compatible with wireless charging.'
  },
  features: {
    sr: [
      'Precizno isečeni otvori za sve portove i kameru',
      '100% kompatibilnost sa bežičnim punjenjem',
      'Povišene ivice za zaštitu ekrana i kamere',
      'Prvoklasni silikon koji ne klizi',
      'Tanka i lagana konstrukcija'
    ],
    en: [
      'Precisely cut openings for all ports and the camera',
      '100% compatibility with wireless charging',
      'Raised edges to protect the screen and camera',
      'Premium non-slip silicone',
      'Thin and lightweight construction'
    ]
  },
  inStock: true,
  sku: 'MSK-IP14P-BLK',
  shippingInfo: {
    sr: 'Besplatna dostava za porudžbine preko 3000 RSD',
    en: 'Free shipping for orders over 3000 RSD'
  },
  warranty: {
    sr: '12 meseci garancije',
    en: '12 months warranty'
  }
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // In a real application, we would fetch the product data based on the ID
  // For now, we'll just use the mock data
  const product = mockProduct;
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name[language],
      price: product.price,
      image: product.images[0]
    });
    
    toast({
      title: language === 'sr' ? 'Proizvod dodat u korpu' : 'Product added to cart',
      description: product.name[language],
    });
  };
  
  const translations = {
    addToCart: {
      sr: 'Dodaj u korpu',
      en: 'Add to Cart',
    },
    description: {
      sr: 'Opis',
      en: 'Description',
    },
    features: {
      sr: 'Karakteristike',
      en: 'Features',
    },
    reviews: {
      sr: 'Recenzije',
      en: 'Reviews',
    },
    inStock: {
      sr: 'Na stanju',
      en: 'In Stock',
    },
    outOfStock: {
      sr: 'Nije na stanju',
      en: 'Out of Stock',
    },
    sku: {
      sr: 'Šifra proizvoda',
      en: 'SKU',
    },
    brand: {
      sr: 'Brend',
      en: 'Brand',
    },
    compatibility: {
      sr: 'Kompatibilnost',
      en: 'Compatibility',
    },
    material: {
      sr: 'Materijal',
      en: 'Material',
    },
    quantity: {
      sr: 'Količina',
      en: 'Quantity',
    },
    shipping: {
      sr: 'Dostava',
      en: 'Shipping',
    },
    warranty: {
      sr: 'Garancija',
      en: 'Warranty',
    },
    wishlist: {
      sr: 'Dodaj u listu želja',
      en: 'Add to Wishlist',
    },
    share: {
      sr: 'Podeli',
      en: 'Share',
    },
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                {language === 'sr' ? 'Početna' : 'Home'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/proizvodi">
                {language === 'sr' ? 'Proizvodi' : 'Products'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${product.category[language].toLowerCase().replace(' ', '-')}`}>
                {product.category[language]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground">
                {product.name[language]}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-white aspect-square">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name[language]} 
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button 
                  key={index} 
                  className={`border rounded-md overflow-hidden ${index === selectedImage ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name[language]} - thumbnail ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name[language]}</h1>
            
            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className="h-5 w-5"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({product.reviewCount} {language === 'sr' ? 'recenzija' : 'reviews'})
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{product.price.toLocaleString()} RSD</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString()} RSD
                  </span>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {translations.shipping[language]}: {product.shippingInfo[language]}
              </div>
            </div>
            
            {/* Quick details */}
            <div className="grid grid-cols-2 gap-y-2 mb-6">
              <div className="text-sm text-muted-foreground">{translations.sku[language]}:</div>
              <div className="text-sm">{product.sku}</div>
              
              <div className="text-sm text-muted-foreground">{translations.brand[language]}:</div>
              <div className="text-sm">{product.brand}</div>
              
              <div className="text-sm text-muted-foreground">{translations.material[language]}:</div>
              <div className="text-sm">{product.material[language]}</div>
              
              <div className="text-sm text-muted-foreground">{translations.compatibility[language]}:</div>
              <div className="text-sm">{product.compatibility.join(', ')}</div>
            </div>
            
            {/* Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="text-sm font-medium mr-4">{translations.quantity[language]}:</div>
                <div className="flex border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-r-none"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center w-12 border-x">
                    {quantity}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-l-none"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="ml-auto flex items-center">
                  {product.inStock ? (
                    <span className="text-green-600 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-600 mr-1.5"></div>
                      {translations.inStock[language]}
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
                      {translations.outOfStock[language]}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {translations.addToCart[language]}
                </Button>
                
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product details tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full border-b rounded-none justify-start">
            <TabsTrigger value="description">{translations.description[language]}</TabsTrigger>
            <TabsTrigger value="features">{translations.features[language]}</TabsTrigger>
            <TabsTrigger value="reviews">{translations.reviews[language]}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="py-6">
            <div className="prose max-w-none">
              <p>{product.description[language]}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="py-6">
            <div className="prose max-w-none">
              <ul className="space-y-2">
                {product.features[language].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      ✓
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="py-6">
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-primary mb-2">{product.rating.toFixed(1)}</div>
              <div className="flex justify-center text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className="h-5 w-5"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {product.reviewCount} {language === 'sr' ? 'recenzija' : 'reviews'}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
