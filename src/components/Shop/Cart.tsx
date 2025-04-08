
import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const translations = {
    cart: {
      sr: 'Korpa',
      en: 'Cart',
    },
    emptyCart: {
      sr: 'Vaša korpa je prazna',
      en: 'Your cart is empty',
    },
    startShopping: {
      sr: 'Započnite kupovinu',
      en: 'Start shopping',
    },
    checkout: {
      sr: 'Nastavi na plaćanje',
      en: 'Proceed to checkout',
    },
    total: {
      sr: 'Ukupno',
      en: 'Total',
    },
    currency: {
      sr: 'RSD',
      en: 'RSD',
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
          {totalItems > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl">{translations.cart[language]}</SheetTitle>
          <Separator />
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto py-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 pb-4 border-b">
                  <div className="h-16 w-16 bg-secondary/20 rounded overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between">
                      <Link to={`/proizvod/${item.id}`} className="font-medium hover:text-primary truncate">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.price.toLocaleString()} {translations.currency[language]}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-medium">
                        {(item.price * item.quantity).toLocaleString()} {translations.currency[language]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="flex-shrink-0 pt-2 border-t">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{translations.total[language]}:</span>
                  <span className="text-xl font-bold">
                    {totalPrice.toLocaleString()} {translations.currency[language]}
                  </span>
                </div>
                <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                  <Link to="/checkout">{translations.checkout[language]}</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow py-10 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-xl font-medium mb-4">{translations.emptyCart[language]}</p>
            <SheetClose asChild>
              <Button asChild>
                <Link to="/proizvodi">{translations.startShopping[language]}</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
