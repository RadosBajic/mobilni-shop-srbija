
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart, Heart, Share2, Star, ChevronRight, Minus, Plus, Loader2, AlertTriangle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProductService } from '@/services/ProductService';
import { Product } from '@/components/Products/ProductCard';
import FeaturedProducts from '@/components/Home/FeaturedProducts';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) {
          throw new Error('Product ID is missing');
        }
        const productData = await ProductService.getProductById(id);
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
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
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'sr' ? 'sr-RS' : 'en-US', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 0,
    }).format(price);
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
    relatedProducts: {
      sr: 'Slični proizvodi',
      en: 'Related Products',
    },
    loading: {
      sr: 'Učitavanje...',
      en: 'Loading...',
    },
    errorLoading: {
      sr: 'Greška pri učitavanju proizvoda',
      en: 'Error loading product',
    },
    tryAgain: {
      sr: 'Pokušajte ponovo',
      en: 'Try again',
    },
    productNotFound: {
      sr: 'Proizvod nije pronađen',
      en: 'Product not found',
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <div className="text-xl font-medium">{translations.loading[language]}</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>
              {error || translations.productNotFound[language]}
            </AlertDescription>
          </Alert>
          <Button asChild>
            <a href="/proizvodi">{language === 'sr' ? 'Pogledaj sve proizvode' : 'Browse all products'}</a>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Mock data for additional details
  const mockProductDetails = {
    rating: 4.5,
    reviewCount: 28,
    images: [product.image],
    category: {
      sr: product.category === 'phone-cases' ? 'Maske za telefone' :
          product.category === 'screen-protectors' ? 'Zaštita ekrana' :
          product.category === 'headphones' ? 'Slušalice' :
          product.category === 'chargers' ? 'Punjači' :
          product.category === 'cables' ? 'Kablovi' : 'Ostalo',
      en: product.category === 'phone-cases' ? 'Phone Cases' :
          product.category === 'screen-protectors' ? 'Screen Protectors' :
          product.category === 'headphones' ? 'Headphones' :
          product.category === 'chargers' ? 'Chargers' :
          product.category === 'cables' ? 'Cables' : 'Other'
    },
    brand: 'MobShop',
    compatibility: product.category === 'phone-cases' ? ['iPhone 14 Pro', 'iPhone 14 Pro Max'] :
                  product.category === 'screen-protectors' ? ['Samsung Galaxy S23 Ultra'] : [],
    material: {
      sr: product.category === 'phone-cases' ? 'Silikon' : 'Plastika',
      en: product.category === 'phone-cases' ? 'Silicone' : 'Plastic'
    },
    description: {
      sr: `Ovo je ${product.title.sr.toLowerCase()}. Visok kvalitet izrade i materijala garantuje dugotrajnu upotrebu i zaštitu vašeg uređaja.`,
      en: `This is a ${product.title.en.toLowerCase()}. High quality materials and craftsmanship ensure long-lasting use and protection for your device.`
    },
    features: {
      sr: [
        'Precizno isečeni otvori za sve portove i kameru',
        '100% kompatibilnost sa bežičnim punjenjem',
        'Povišene ivice za zaštitu ekrana i kamere',
        'Prvoklasni materijali koji ne klize',
        'Tanka i lagana konstrukcija'
      ],
      en: [
        'Precisely cut openings for all ports and the camera',
        '100% compatibility with wireless charging',
        'Raised edges to protect the screen and camera',
        'Premium non-slip materials',
        'Thin and lightweight construction'
      ]
    },
    inStock: true,
    sku: `MS-${product.id.toUpperCase()}`,
    shippingInfo: {
      sr: 'Besplatna dostava za porudžbine preko 3000 RSD',
      en: 'Free shipping for orders over 3000 RSD'
    },
    warranty: {
      sr: '12 meseci garancije',
      en: '12 months warranty'
    }
  };

  // If we only have one image, duplicate it
  const productImages = mockProductDetails.images.length === 1 
    ? [mockProductDetails.images[0], mockProductDetails.images[0], mockProductDetails.images[0], mockProductDetails.images[0]]
    : mockProductDetails.images;
    
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
              <BreadcrumbLink href={`/category/${product.category}`}>
                {mockProductDetails.category[language]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground">
                {product.title[language]}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-white aspect-square">
              <img 
                src={productImages[selectedImage]} 
                alt={product.title[language]} 
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button 
                  key={index} 
                  className={`border rounded-md overflow-hidden ${index === selectedImage ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.title[language]} - thumbnail ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title[language]}</h1>
            
            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.floor(mockProductDetails.rating) ? "currentColor" : "none"} 
                    className="h-5 w-5"
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">
                ({mockProductDetails.reviewCount} {language === 'sr' ? 'recenzija' : 'reviews'})
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {translations.shipping[language]}: {mockProductDetails.shippingInfo[language]}
              </div>
            </div>
            
            {/* Quick details */}
            <div className="grid grid-cols-2 gap-y-2 mb-6">
              <div className="text-sm text-muted-foreground">{translations.sku[language]}:</div>
              <div className="text-sm">{mockProductDetails.sku}</div>
              
              <div className="text-sm text-muted-foreground">{translations.brand[language]}:</div>
              <div className="text-sm">{mockProductDetails.brand}</div>
              
              {mockProductDetails.material && (
                <>
                  <div className="text-sm text-muted-foreground">{translations.material[language]}:</div>
                  <div className="text-sm">{mockProductDetails.material[language]}</div>
                </>
              )}
              
              {mockProductDetails.compatibility && mockProductDetails.compatibility.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground">{translations.compatibility[language]}:</div>
                  <div className="text-sm">{mockProductDetails.compatibility.join(', ')}</div>
                </>
              )}
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
                  {mockProductDetails.inStock ? (
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
                <Button className="flex-1" onClick={handleAddToCart} disabled={!mockProductDetails.inStock}>
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
              <p>{mockProductDetails.description[language]}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="py-6">
            <div className="prose max-w-none">
              <ul className="space-y-2">
                {mockProductDetails.features[language].map((feature, index) => (
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
              <div className="text-6xl font-bold text-primary mb-2">{mockProductDetails.rating.toFixed(1)}</div>
              <div className="flex justify-center text-amber-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    fill={i < Math.floor(mockProductDetails.rating) ? "currentColor" : "none"} 
                    className="h-5 w-5"
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {mockProductDetails.reviewCount} {language === 'sr' ? 'recenzija' : 'reviews'}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Related products */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">{translations.relatedProducts[language]}</h2>
          <FeaturedProducts limit={4} />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
