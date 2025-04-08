import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

// Mock product data
const mockProduct = {
  id: 'p1',
  name: 'iPhone 14 Pro silikonska maska - crna',
  sku: 'IP14P-CASE-BLK',
  price: 2499,
  oldPrice: 2999,
  stock: 45,
  description: `
    <p>Premium silikonska maska za Apple iPhone 14 Pro.</p>
    <p>Izrađena od visokokvalitetnog silikona koji pruža odličnu zaštitu od udaraca i ogrebotina.</p>
    <p>Savršeno pristaje telefonu i omogućava pristup svim portovima i dugmadima.</p>
  `,
  features: [
    'Izrađeno od premium silikona',
    'Tačno pristaje iPhone 14 Pro modelu',
    'Zaštita od udaraca i ogrebotina',
    'Ne kliza se u rukama',
    'Lako se postavlja i skida',
    'Pruža pristup svim portovima i dugmadima'
  ],
  specs: [
    { name: 'Materijal', value: 'Silikon' },
    { name: 'Kompatibilnost', value: 'iPhone 14 Pro' },
    { name: 'Boja', value: 'Crna' },
    { name: 'Težina', value: '35g' },
    { name: 'Dimenzije', value: '147.5 x 71.5 x 10.8 mm' },
    { name: 'Proizvođač', value: 'TechGear' }
  ],
  rating: 4.5,
  reviewCount: 28,
  images: [
    'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631281956016-3cdc1b2fe5fb?q=80&w=500&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592813930217-6f28583fd11d?q=80&w=500&auto=format&fit=crop',
  ],
  category: 'Maske za telefone',
  tags: ['iPhone', 'iPhone 14 Pro', 'Maska', 'Silikon', 'Crna'],
  related: [
    {
      id: 'p2',
      name: 'iPhone 14 Pro staklena zaštita ekrana',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=100&auto=format&fit=crop',
    },
    {
      id: 'p3',
      name: 'iPhone 14 Pro providna maska',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=100&auto=format&fit=crop',
    },
    {
      id: 'p4',
      name: 'USB-C na Lightning kabl - 2m',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1606292943133-cc1b0ff0e295?q=80&w=100&auto=format&fit=crop',
    },
  ]
};

// Reviews data
const mockReviews = [
  {
    id: 1,
    author: 'Marko P.',
    date: '03.04.2025',
    rating: 5,
    text: 'Odlična maska! Kvalitet je izvanredan i savršeno pristaje mom telefonu. Preporučujem!'
  },
  {
    id: 2,
    author: 'Ana J.',
    date: '28.03.2025',
    rating: 4,
    text: 'Maska je dobra, materijal je kvalitetan. Jedina mana je što je malo klizava u rukama.'
  },
  {
    id: 3,
    author: 'Nikola S.',
    date: '15.03.2025',
    rating: 5,
    text: 'Savršeno pristaje mom iPhone-u, a i izgleda jako lepo. Već sam je ispustio par puta i telefon je ostao netaknut. Definitivno vredi svaki dinar.'
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { language } = useLanguage();

  // In a real app, we would fetch the product by ID
  // For now, we'll just use our mock data
  const product = mockProduct;

  const translations = {
    addToCart: {
      sr: 'Dodaj u korpu',
      en: 'Add to Cart',
    },
    addedToCart: {
      sr: 'Proizvod dodat u korpu',
      en: 'Product added to cart',
    },
    inStock: {
      sr: 'Na stanju',
      en: 'In Stock',
    },
    outOfStock: {
      sr: 'Nije na stanju',
      en: 'Out of Stock',
    },
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
    
    toast({
      title: translations.addedToCart[language],
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
              <BreadcrumbLink href="/kategorije">Kategorije</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/kategorije/${product.category}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-muted-foreground">{product.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden hover-lift transition-all">
              <AspectRatio ratio={1 / 1}>
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="flex gap-3">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  className={`border rounded w-24 hover-lift transition-all ${selectedImage === idx ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <AspectRatio ratio={1 / 1}>
                    <img src={image} alt={`${product.name} - slika ${idx + 1}`} className="object-cover" />
                  </AspectRatio>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.oldPrice > product.price && (
                  <Badge variant="destructive" className="animate-pulse-accent">
                    Akcija
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-none'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} · {product.reviewCount} recenzija
                </span>
              </div>

              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold">{product.price.toLocaleString()} RSD</span>
                {product.oldPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.oldPrice.toLocaleString()} RSD
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                {product.stock > 0 ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    {translations.inStock[language]}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {translations.outOfStock[language]}
                  </Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div>

              <div className="prose max-w-none dark:prose-invert mb-6" 
                dangerouslySetInnerHTML={{ __html: product.description }}>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="font-medium">Karakteristike:</div>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Add to cart section */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-md">
                  <button 
                    className="px-3 py-2 hover:bg-muted transition-colors"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button 
                    className="px-3 py-2 hover:bg-muted transition-colors"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1 hover-scale"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {translations.addToCart[language]}
                </Button>
                
                <Button variant="outline" size="icon" className="hover-scale">
                  <Heart className="h-5 w-5" />
                </Button>
                
                <Button variant="outline" size="icon" className="hover-scale">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {product.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="hover-scale cursor-pointer">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Specifications and Reviews */}
        <Tabs defaultValue="specifications" className="mb-12">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="specifications">Specifikacije</TabsTrigger>
            <TabsTrigger value="reviews">Recenzije</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <table className="min-w-full">
                  <tbody>
                    {product.specs.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-muted/50' : ''}>
                        <td className="py-3 px-4 font-medium">{spec.name}</td>
                        <td className="py-3 px-4">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">{review.author}</span>
                        <div className="flex items-center text-amber-500 my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'fill-none'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p>{review.text}</p>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  Prikaži sve recenzije
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Povezani proizvodi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {product.related.map((item) => (
              <Card key={item.id} className="overflow-hidden hover-lift transition-all">
                <div className="p-4">
                  <AspectRatio ratio={1 / 1} className="rounded-md overflow-hidden mb-4">
                    <img src={item.image} alt={item.name} className="object-cover" />
                  </AspectRatio>
                  <h3 className="font-medium line-clamp-2 mb-2">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{item.price.toLocaleString()} RSD</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full"
                      onClick={() => {
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        });
                        toast({
                          title: translations.addedToCart[language],
                          description: item.name,
                        });
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
