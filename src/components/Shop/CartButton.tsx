
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

const CartButton: React.FC = () => {
  const { totalItems } = useCart();
  
  return (
    <Button variant="ghost" size="icon" asChild className="relative">
      <Link to="/cart">
        <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
        {totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalItems}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default CartButton;
