
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from './ProductCard';

interface PremiumProductCardProps {
  product: Product;
  withAnimations?: boolean;
}

const PremiumProductCard: React.FC<PremiumProductCardProps> = ({ 
  product, 
  withAnimations = true 
}) => {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('sr-RS');
  };

  return (
    <div 
      className={`group relative rounded-lg overflow-hidden bg-card transition-all duration-300 ${
        withAnimations ? 'hover:shadow-premium dark:hover:shadow-premium-dark' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={product.image} 
            alt={product.title[language]} 
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered && withAnimations ? 'scale-110' : 'scale-100'
            }`}
          />
          
          {/* Overlay on hover */}
          {withAnimations && (
            <div className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />
          )}
          
          {/* Favorite button */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background z-10 transition-all duration-300 ${
              isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'
            } ${withAnimations && !isHovered ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
            onClick={handleFavoriteToggle}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Product badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-primary hover:bg-primary/90">New</Badge>
            )}
            {product.isOnSale && (
              <Badge className="bg-accent hover:bg-accent/90">Sale</Badge>
            )}
          </div>
        </div>
        
        {/* Product details */}
        <div className="p-4">
          <h3 className="font-medium line-clamp-2 h-12 group-hover:text-primary transition-colors">
            {product.title[language]}
          </h3>
          
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">
                {withAnimations && isHovered ? (
                  <AnimatedCounter 
                    value={product.price} 
                    formatter={formatPrice} 
                    suffix=" RSD" 
                    duration={800}
                  />
                ) : (
                  `${formatPrice(product.price)} RSD`
                )}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)} RSD
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Add to cart button (appears on hover) */}
        {withAnimations && (
          <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 via-background/60 to-transparent transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <Button className="w-full gap-2 shadow-sm">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        )}
      </Link>
    </div>
  );
};

export default PremiumProductCard;
