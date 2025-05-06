
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartUpdated, setIsCartUpdated] = useState(false);
  
  // Highlight cart icon when items are added
  useEffect(() => {
    if (totalItems > 0) {
      setIsCartUpdated(true);
      const timer = setTimeout(() => setIsCartUpdated(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

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
    clearCart: {
      sr: 'Isprazni korpu',
      en: 'Clear cart',
    },
    total: {
      sr: 'Ukupno',
      en: 'Total',
    },
    subtotal: {
      sr: 'Međuzbir',
      en: 'Subtotal', 
    },
    shipping: {
      sr: 'Dostava',
      en: 'Shipping',
    },
    currency: {
      sr: 'RSD',
      en: 'RSD',
    }
  };
  
  const handleRemoveItem = (id: string, name: string) => {
    removeFromCart(id);
    toast({
      title: language === 'sr' ? 'Proizvod uklonjen iz korpe' : 'Item removed from cart',
      description: name,
    });
  };
  
  const handleClearCart = () => {
    clearCart();
    toast({
      title: language === 'sr' ? 'Korpa je ispražnjena' : 'Cart cleared',
      description: language === 'sr' ? 'Svi proizvodi su uklonjeni' : 'All items have been removed',
    });
  };

  // Format price with locale
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'sr' ? 'sr-RS' : 'en-US', {
      style: 'currency',
      currency: 'RSD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`relative ${isCartUpdated ? 'animate-pulse ring-2 ring-primary' : ''}`}
        >
          <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="space-y-2">
          <SheetTitle className="text-xl flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {translations.cart[language]} 
            {totalItems > 0 && (
              <Badge variant="outline" className="ml-auto">
                {totalItems} {language === 'sr' ? 'proizvoda' : 'items'}
              </Badge>
            )}
          </SheetTitle>
          <Separator />
        </SheetHeader>

        <AnimatePresence mode="wait">
          {items.length > 0 ? (
            <motion.div 
              key="cart-items"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <div className="flex-grow overflow-y-auto py-6 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="flex items-start gap-4 pb-4 border-b"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ 
                        opacity: 0, 
                        x: -100, 
                        transition: { duration: 0.2 } 
                      }}
                      layout
                    >
                      <div className="h-16 w-16 bg-secondary/20 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between">
                          <Link 
                            to={`/proizvod/${item.id}`} 
                            className="font-medium hover:text-primary truncate"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                          <button 
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {formatPrice(item.price)}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-secondary transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 text-sm min-w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-secondary transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <SheetFooter className="flex-shrink-0 pt-2 border-t">
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{translations.subtotal[language]}:</span>
                      <span className="font-medium">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{translations.shipping[language]}:</span>
                      <span className="font-medium">
                        {formatPrice(totalPrice > 5000 ? 0 : 390)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{translations.total[language]}:</span>
                      <span className="text-xl font-bold">
                        {formatPrice(totalPrice + (totalPrice > 5000 ? 0 : 390))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearCart}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      {translations.clearCart[language]}
                    </Button>
                    
                    <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/checkout" className="flex items-center gap-2">
                        {translations.checkout[language]}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetFooter>
            </motion.div>
          ) : (
            <motion.div 
              key="empty-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center flex-grow py-10 text-center"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-muted/30 p-8 rounded-full mb-4"
              >
                <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
              </motion.div>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-medium mb-4"
              >
                {translations.emptyCart[language]}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <SheetClose asChild>
                  <Button asChild>
                    <Link to="/proizvodi">{translations.startShopping[language]}</Link>
                  </Button>
                </SheetClose>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
