
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { ProductService } from '@/services/ProductService';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  MinusCircle, 
  PlusCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Truck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Rating from '@/components/Reviews/Rating';
import ProductReviews from '@/components/Reviews/ProductReviews';
import RelatedProducts from '@/components/Products/RelatedProducts';

interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const product = await ProductService.getProductById(id);
        setProduct(product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Nije moguće učitati proizvod'
            : 'Unable to load product',
          variant: 'destructive'
        });
        navigate('/proizvodi');
      } finally {
        setLoading(false);
      }
    };
    
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id, navigate, toast, language]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.title[language],
      price: product.price,
      image: product.image,
      quantity // Now correctly passing quantity
    });
    
    toast({
      title: language === 'sr' ? 'Proizvod dodat u korpu' : 'Product added to cart',
      description: product.title[language],
    });
  };
  
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-1/2 mt-4" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'sr' ? 'Proizvod nije pronađen' : 'Product not found'}
          </h2>
          <Button onClick={() => navigate('/proizvodi')}>
            {language === 'sr' ? 'Nazad na proizvode' : 'Back to products'}
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  // Format price with locale
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'sr' ? 'sr-RS' : 'en-US', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center space-x-1">
            <li>
              <a href="/" className="hover:text-primary transition-colors">
                {language === 'sr' ? 'Početna' : 'Home'}
              </a>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              <a href="/proizvodi" className="hover:text-primary transition-colors">
                {language === 'sr' ? 'Proizvodi' : 'Products'}
              </a>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              <a href={`/kategorija/${product.category}`} className="hover:text-primary transition-colors">
                {product.categoryName?.[language] || product.category}
              </a>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="font-medium text-foreground">
                {product.title[language]}
              </span>
            </li>
          </ol>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-white dark:bg-gray-900 relative">
              {product.isOnSale && (
                <Badge variant="destructive" className="absolute top-4 left-4 z-10">
                  {language === 'sr' ? 'Akcija' : 'Sale'}
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-4 right-4 z-10 bg-green-500 hover:bg-green-600">
                  {language === 'sr' ? 'Novo' : 'New'}
                </Badge>
              )}
              <img 
                src={product.images?.[activeImage] || product.image} 
                alt={product.title[language]} 
                className="h-full w-full object-cover object-center animate-fade-in"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`aspect-square border rounded overflow-hidden ${
                      activeImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.title[language]} - ${index + 1}`} 
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.title[language]}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Rating value={product.rating || 4.5} size="sm" />
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount || 24} {language === 'sr' ? 'recenzija' : 'reviews'})
                </span>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {product.oldPrice && (
                  <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-500 dark:border-amber-800/30">
                    {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
              
              {/* Short description */}
              <p className="text-muted-foreground">
                {product.shortDescription?.[language] || 'No description available'}
              </p>
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">{language === 'sr' ? 'Količina' : 'Quantity'}:</span>
              <div className="flex items-center border border-input rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <MinusCircle size={18} />
                </button>
                <span className="w-10 text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <PlusCircle size={18} />
                </button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {product.inStock ? (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    {language === 'sr' ? 'Na stanju' : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-destructive flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-destructive"></div>
                    {language === 'sr' ? 'Nije na stanju' : 'Out of Stock'}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAddToCart} 
                disabled={!product.inStock} 
                size="lg"
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {language === 'sr' ? 'Dodaj u korpu' : 'Add to Cart'}
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" aria-label="Add to wishlist">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Share product">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{language === 'sr' ? 'Brza dostava' : 'Fast Delivery'}</p>
                  <p className="text-sm text-muted-foreground">{language === 'sr' ? '1-3 radna dana' : '1-3 business days'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{language === 'sr' ? 'Garancija' : 'Warranty'}</p>
                  <p className="text-sm text-muted-foreground">{language === 'sr' ? '2 godine' : '2 years'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{language === 'sr' ? 'Povraćaj' : 'Returns'}</p>
                  <p className="text-sm text-muted-foreground">{language === 'sr' ? '30 dana' : '30 days'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{language === 'sr' ? 'Podrška' : 'Support'}</p>
                  <p className="text-sm text-muted-foreground">{language === 'sr' ? 'Radnim danima' : 'Business days'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product details tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b grid grid-cols-3 md:grid-cols-4 mb-8 rounded-none bg-transparent border-0">
              <TabsTrigger 
                value="description" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {language === 'sr' ? 'Opis' : 'Description'}
              </TabsTrigger>
              <TabsTrigger 
                value="specs" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {language === 'sr' ? 'Specifikacije' : 'Specifications'}
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {language === 'sr' ? 'Recenzije' : 'Reviews'}
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {language === 'sr' ? 'Isporuka' : 'Shipping'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-2 animate-fade-in">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>{product.description?.[language] || product.shortDescription?.[language] || 'No description available'}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="pt-2 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">{language === 'sr' ? 'Tehničke specifikacije' : 'Technical Specifications'}</h3>
                  <div className="space-y-2">
                    {product.specifications ? (
                      Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 border-b pb-2">
                          <span className="font-medium">{key}</span>
                          <span>{value as string}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">{language === 'sr' ? 'Nisu dostupne specifikacije' : 'No specifications available'}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">{language === 'sr' ? 'Dodatne informacije' : 'Additional Information'}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">{language === 'sr' ? 'Dimenzije' : 'Dimensions'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.dimensions || '10 x 5 x 2 cm'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">{language === 'sr' ? 'Težina' : 'Weight'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.weight || '250g'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">{language === 'sr' ? 'Materijali' : 'Materials'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.materials || language === 'sr' ? 'Plastika, Metal' : 'Plastic, Metal'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-2 animate-fade-in">
              <ProductReviews productId={product.id} />
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-2 animate-fade-in">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'sr' ? 'Dostava' : 'Delivery'}</h3>
                  <p className="text-muted-foreground mb-4">
                    {language === 'sr' 
                      ? 'Dostava se vrši kurirskom službom na teritoriji cele Srbije.'
                      : 'Delivery is carried out by courier service throughout Serbia.'}
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">{language === 'sr' ? 'Rokovi isporuke' : 'Delivery times'}</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between border-b pb-2">
                        <span>{language === 'sr' ? 'Beograd' : 'Belgrade'}</span>
                        <span>1-2 {language === 'sr' ? 'dana' : 'days'}</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span>{language === 'sr' ? 'Veći gradovi' : 'Major cities'}</span>
                        <span>2-3 {language === 'sr' ? 'dana' : 'days'}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>{language === 'sr' ? 'Ostala mesta' : 'Other locations'}</span>
                        <span>3-5 {language === 'sr' ? 'dana' : 'days'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">{language === 'sr' ? 'Povraćaj i reklamacije' : 'Returns and complaints'}</h3>
                  <p className="text-muted-foreground">
                    {language === 'sr' 
                      ? 'Kupac ima pravo na povraćaj u roku od 14 dana od dana prijema proizvoda, bez navođenja razloga.'
                      : 'The customer has the right to return within 14 days from the day of receiving the product, without stating reasons.'}
                  </p>
                  
                  <div className="bg-muted/30 p-4 rounded-lg mt-4">
                    <h4 className="font-medium mb-2">{language === 'sr' ? 'Proces povraćaja' : 'Return process'}</h4>
                    <ol className="space-y-2 text-sm list-decimal pl-4">
                      <li>{language === 'sr' 
                        ? 'Kontaktirajte našu korisničku podršku' 
                        : 'Contact our customer support'}</li>
                      <li>{language === 'sr' 
                        ? 'Popunite formular za povraćaj' 
                        : 'Fill out the return form'}</li>
                      <li>{language === 'sr' 
                        ? 'Spakujte proizvod u originalnu ambalažu' 
                        : 'Pack the product in its original packaging'}</li>
                      <li>{language === 'sr' 
                        ? 'Pošaljite proizvod na našu adresu' 
                        : 'Send the product to our address'}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            {language === 'sr' ? 'Slični proizvodi' : 'Related Products'}
          </h2>
          <RelatedProducts 
            categoryId={product.category} 
            currentProductId={product.id}
          />
        </div>
      </div>
      
      <ScrollToTop />
    </MainLayout>
  );
};

export default ProductDetail;
