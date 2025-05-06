
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from './ProductCard';

interface EnhancedProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({ 
  product,
  showQuickAdd = true
}) => {
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <div className="group relative bg-card overflow-hidden rounded-lg border hover:shadow-lg transition-all">
      <Link to={`/proizvod/${product.id}`} className="block">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={product.image || '/placeholder.svg'} 
            alt={product.title[language]} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              {language === 'sr' ? 'Novo' : 'New'}
            </Badge>
          )}
          
          {product.isOnSale && product.oldPrice && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium truncate">{product.title[language]}</h3>
          
          <div className="mt-2 flex items-center gap-2">
            <span className="font-bold text-lg">{product.price.toLocaleString()} RSD</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.oldPrice.toLocaleString()} RSD
              </span>
            )}
          </div>
          
          {showQuickAdd && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                {language === 'sr' ? 'Dodaj u korpu' : 'Add to cart'}
              </Button>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default EnhancedProductCard;
