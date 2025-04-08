
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'sr' ? 'sr-RS' : 'en-US', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.title[language],
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    toast({
      title: language === 'sr' ? 'Proizvod dodat u korpu' : 'Product added to cart',
      description: product.title[language],
    });
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-200 card-hover">
      <Link to={`/proizvod/${product.id}`} className="block relative">
        {/* Product image */}
        <div className="aspect-square overflow-hidden bg-secondary/40">
          <img 
            src={product.image}
            alt={product.title[language]}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-primary text-white">
              {language === 'sr' ? 'Novo' : 'New'}
            </Badge>
          )}
          {product.isOnSale && (
            <Badge className="bg-accent text-white">
              {language === 'sr' ? 'Akcija' : 'Sale'}
            </Badge>
          )}
        </div>
      </Link>

      {/* Product info */}
      <div className="p-4">
        <Link to={`/proizvod/${product.id}`} className="block">
          <h3 className="font-medium text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title[language]}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-muted-foreground line-through text-sm">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <Button size="sm" className="rounded-full" variant="outline" onClick={handleAddToCart}>
            <ShoppingCart size={16} className="mr-1" />
            <span className="sr-only md:not-sr-only md:inline">{t('addToCart')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
