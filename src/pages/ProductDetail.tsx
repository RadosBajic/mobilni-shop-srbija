
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  MinusIcon, 
  PlusIcon, 
  ShoppingCart, 
  ArrowLeft, 
  Heart,
  Share,
  Truck, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/components/Products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Rating from '@/components/Reviews/Rating';
import ProductReviews from '@/components/Reviews/ProductReviews';
import RelatedProducts from '@/components/Products/RelatedProducts';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<string>("description");
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        if (id) {
          const productData = await ProductService.getProductById(id);
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.title[language],
      price: product.price,
      image: product.image,
      quantity
    });
    
    toast({
      title: language === 'sr' ? 'Proizvod dodat u korpu' : 'Product added to cart',
      description: `${quantity}x ${product.title[language]}`,
    });
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  const translations = {
    loading: {
      sr: 'Učitavanje proizvoda...',
      en: 'Loading product...',
    },
    notFound: {
      sr: 'Proizvod nije pronađen',
      en: 'Product not found',
    },
    backToProducts: {
      sr: 'Nazad na proizvode',
      en: 'Back to products',
    },
    products: {
      sr: 'Proizvodi',
      en: 'Products',
    },
    inStock: {
      sr: 'Na stanju',
      en: 'In Stock',
    },
    outOfStock: {
      sr: 'Nema na stanju',
      en: 'Out of Stock',
    },
    quantity: {
      sr: 'Količina',
      en: 'Quantity',
    },
    addToCart: {
      sr: 'Dodaj u korpu',
      en: 'Add to Cart',
    },
    description: {
      sr: 'Opis',
      en: 'Description',
    },
    specifications: {
      sr: 'Specifikacije',
      en: 'Specifications',
    },
    reviews: {
      sr: 'Recenzije',
      en: 'Reviews',
    },
    shipping: {
      sr: 'Dostava',
      en: 'Shipping',
    },
    shippingInfo: {
      sr: 'Besplatna dostava za sve porudžbine iznad 3000 RSD.',
      en: 'Free shipping for all orders above 3000 RSD.',
    },
    warranty: {
      sr: 'Garancija',
      en: 'Warranty',
    },
    warrantyInfo: {
      sr: 'Garancija proizvođača 24 meseca.',
      en: 'Manufacturer warranty 24 months.',
    },
    payment: {
      sr: 'Plaćanje',
      en: 'Payment',
    },
    paymentInfo: {
      sr: 'Plaćanje pouzećem, karticom ili preko računa.',
      en: 'Cash on delivery, credit card or bank transfer.',
    },
    price: {
      sr: 'Cena',
      en: 'Price',
    },
    noDescription: {
      sr: 'Nema opisa za ovaj proizvod.',
      en: 'No description available for this product.',
    },
    noSpecifications: {
      sr: 'Nema tehničkih specifikacija za ovaj proizvod.',
      en: 'No technical specifications available for this product.',
    },
    new: {
      sr: 'Novo',
      en: 'New',
    },
    sale: {
      sr: 'Akcija',
      en: 'Sale',
    },
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12 flex justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-4xl">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-2/3"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
                <div className="h-12 bg-muted rounded w-1/3"></div>
                <div className="h-12 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{translations.notFound[language]}</h1>
          <Button asChild>
            <Link to="/proizvodi">
              {translations.backToProducts[language]}
            </Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Sample description - in real app this would come from the product data
  const productDescription = language === 'sr' 
    ? 'Ovo je detaljan opis proizvoda na srpskom jeziku. Ovde bi trebalo da stoji sve o karakteristikama, prednostima i načinu korišćenja proizvoda.'
    : 'This is a detailed product description in English. Here should be all information about features, benefits and usage of the product.';

  // Sample specifications - in real app these would come from the product data  
  const specifications = [
    { name: { sr: 'Dimenzije', en: 'Dimensions' }, value: '10 x 5 x 2 cm' },
    { name: { sr: 'Težina', en: 'Weight' }, value: '150g' },
    { name: { sr: 'Materijal', en: 'Material' }, value: { sr: 'Plastika', en: 'Plastic' } },
    { name: { sr: 'Boja', en: 'Color' }, value: { sr: 'Crna', en: 'Black' } },
  ];
  
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/proizvodi">
                {translations.products[language]}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                {product.title[language]}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Product Image */}
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="aspect-square relative">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.title[language]} 
                className="w-full h-full object-contain p-4"
              />
              
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-green-500 hover:bg-green-600">
                  {translations.new[language]}
                </Badge>
              )}
              
              {product.isOnSale && product.oldPrice && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </Badge>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold">{product.title[language]}</h1>
            
            <div className="flex items-center gap-2 mt-2">
              <Rating value={4.5} />
              <span className="text-sm text-muted-foreground">(24)</span>
            </div>
            
            <div className="mt-4 flex items-end gap-2">
              <span className="text-3xl font-bold">
                {product.price.toLocaleString()} RSD
              </span>
              
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through mb-1">
                  {product.oldPrice.toLocaleString()} RSD
                </span>
              )}
            </div>
            
            <div className="mt-6 space-y-6">
              {/* Product Status */}
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm">
                  {translations.inStock[language]}
                </span>
              </div>
              
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translations.quantity[language]}
                </label>
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="lg" 
                  className="flex-1 gap-2" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {translations.addToCart[language]}
                </Button>
                
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Product Info Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{translations.shipping[language]}</div>
                    <div className="text-xs text-muted-foreground">{translations.shippingInfo[language]}</div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{translations.warranty[language]}</div>
                    <div className="text-xs text-muted-foreground">{translations.warrantyInfo[language]}</div>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-sm">{translations.payment[language]}</div>
                    <div className="text-xs text-muted-foreground">{translations.paymentInfo[language]}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <Tabs defaultValue="description" value={selectedTab} onValueChange={setSelectedTab} className="mb-10">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="description">{translations.description[language]}</TabsTrigger>
            <TabsTrigger value="specifications">{translations.specifications[language]}</TabsTrigger>
            <TabsTrigger value="reviews">{translations.reviews[language]}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="pt-6">
            <div className="prose prose-sm max-w-none">
              {productDescription || translations.noDescription[language]}
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="pt-6">
            {specifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-start py-2 border-b">
                    <div className="w-1/2 font-medium">
                      {typeof spec.name === 'object' ? spec.name[language] : spec.name}:
                    </div>
                    <div className="w-1/2">
                      {typeof spec.value === 'object' ? spec.value[language] : spec.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">
                {translations.noSpecifications[language]}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-6">
            <ProductReviews productId={product.id} />
          </TabsContent>
        </Tabs>
        
        {/* Related Products */}
        <RelatedProducts productId={product.id} />
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
