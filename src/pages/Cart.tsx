
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { language } = useLanguage();

  const translations = {
    cart: {
      sr: 'Korpa',
      en: 'Shopping Cart',
    },
    emptyCart: {
      sr: 'Vaša korpa je prazna',
      en: 'Your cart is empty',
    },
    startShopping: {
      sr: 'Započnite kupovinu',
      en: 'Start shopping',
    },
    continueShopping: {
      sr: 'Nastavite kupovinu',
      en: 'Continue shopping',
    },
    checkout: {
      sr: 'Nastavi na plaćanje',
      en: 'Proceed to checkout',
    },
    total: {
      sr: 'Ukupno',
      en: 'Total',
    },
    product: {
      sr: 'Proizvod',
      en: 'Product',
    },
    price: {
      sr: 'Cena',
      en: 'Price',
    },
    quantity: {
      sr: 'Količina',
      en: 'Quantity',
    },
    subtotal: {
      sr: 'Međuzbir',
      en: 'Subtotal',
    },
    remove: {
      sr: 'Ukloni',
      en: 'Remove',
    },
    currency: {
      sr: 'RSD',
      en: 'RSD',
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{translations.cart[language]}</h1>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-card rounded-lg shadow-sm border">
                <div className="hidden md:grid grid-cols-5 p-4 border-b">
                  <div className="col-span-2 font-medium">{translations.product[language]}</div>
                  <div className="font-medium text-center">{translations.price[language]}</div>
                  <div className="font-medium text-center">{translations.quantity[language]}</div>
                  <div className="font-medium text-right">{translations.subtotal[language]}</div>
                </div>
                
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-16 h-16 rounded overflow-hidden bg-secondary/20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link to={`/proizvod/${item.id}`} className="font-medium hover:text-primary">
                            {item.name}
                          </Link>
                          <div className="md:hidden flex justify-between mt-2">
                            <span className="text-sm text-muted-foreground">
                              {translations.price[language]}:
                            </span>
                            <span>
                              {item.price.toLocaleString()} {translations.currency[language]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden md:flex justify-center">
                        {item.price.toLocaleString()} {translations.currency[language]}
                      </div>
                      
                      <div className="flex justify-center items-center">
                        <div className="flex items-center border rounded max-w-[120px]">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-secondary"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between md:justify-end items-center">
                        <div className="md:hidden text-sm text-muted-foreground">
                          {translations.subtotal[language]}:
                        </div>
                        <div className="font-medium">
                          {(item.price * item.quantity).toLocaleString()} {translations.currency[language]}
                        </div>
                      </div>
                      
                      <div className="flex md:justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{translations.remove[language]}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-start">
                <Button variant="outline" asChild className="flex items-center gap-2">
                  <Link to="/proizvodi">
                    <ArrowLeft className="h-4 w-4" />
                    {translations.continueShopping[language]}
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">{translations.total[language]}</h2>
                <Separator className="mb-4" />
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.subtotal[language]}</span>
                    <span>{totalPrice.toLocaleString()} {translations.currency[language]}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>{translations.total[language]}</span>
                    <span>{totalPrice.toLocaleString()} {translations.currency[language]}</span>
                  </div>
                </div>
                
                <Button className="w-full" size="lg" asChild>
                  <Link to="/checkout">{translations.checkout[language]}</Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground/50" />
            <h2 className="text-2xl font-medium">{translations.emptyCart[language]}</h2>
            <Button asChild className="mt-4">
              <Link to="/proizvodi">{translations.startShopping[language]}</Link>
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
