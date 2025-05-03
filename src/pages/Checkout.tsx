
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { createNotification } from '@/services/NotificationService';
import { Captcha } from '@/components/ui/captcha';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { OrderService, CreateOrderData } from '@/services/OrderService';

const Checkout: React.FC = () => {
  const { t, language } = useLanguage();
  const { totalItems, totalPrice, items, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const translations = {
    checkout: {
      sr: 'Plaćanje',
      en: 'Checkout',
    },
    backToCart: {
      sr: 'Nazad na korpu',
      en: 'Back to cart',
    },
    itemsInCart: {
      sr: 'artikala u korpi',
      en: 'items in cart',
    },
    total: {
      sr: 'Ukupno:',
      en: 'Total:',
    },
    currency: {
      sr: 'RSD',
      en: 'RSD',
    },
    placeOrder: {
      sr: 'Naruči',
      en: 'Place Order',
    },
    personalInfo: {
      sr: 'Lični podaci',
      en: 'Personal Information',
    },
    fullName: {
      sr: 'Ime i prezime',
      en: 'Full name',
    },
    email: {
      sr: 'Email adresa',
      en: 'Email address',
    },
    phone: {
      sr: 'Broj telefona',
      en: 'Phone number',
    },
    address: {
      sr: 'Adresa',
      en: 'Address',
    },
    city: {
      sr: 'Grad',
      en: 'City',
    },
    postalCode: {
      sr: 'Poštanski broj',
      en: 'Postal code',
    },
    captchaVerification: {
      sr: 'Verifikacija',
      en: 'Verification',
    },
    captchaInfo: {
      sr: 'Molimo vas unesite kod sa slike da dokažete da niste robot',
      en: 'Please enter the code from the image to prove you are not a robot',
    },
    captchaNotVerified: {
      sr: 'Molimo vas verifikujte CAPTCHA pre naručivanja',
      en: 'Please verify the CAPTCHA before placing your order',
    },
    orderSuccess: {
      sr: 'Porudžbina uspešna',
      en: 'Order Successful',
    },
    orderSuccessMessage: {
      sr: 'Vaša porudžbina je uspešno primljena. Uskoro ćete dobiti email sa potvrdom.',
      en: 'Your order has been successfully placed. You will receive a confirmation email shortly.',
    },
    paymentMethod: {
      sr: 'Način plaćanja',
      en: 'Payment method',
    },
    cashOnDelivery: {
      sr: 'Plaćanje pouzećem',
      en: 'Cash on delivery',
    },
    cashOnDeliveryInfo: {
      sr: 'Platite kuriru prilikom preuzimanja pošiljke',
      en: 'Pay the courier when you receive your package',
    },
  };

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const handleSubmit = async (data: any) => {
    if (totalItems === 0) {
      toast({
        title: language === 'sr' ? "Korpa je prazna" : "Cart is empty",
        description: language === 'sr' ? "Dodajte artikle u korpu pre naručivanja" : "Add items to your cart before placing an order",
        variant: "destructive",
      });
      return;
    }

    if (!isCaptchaVerified) {
      toast({
        title: translations.captchaNotVerified[language],
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order data
      const orderData: CreateOrderData = {
        customerId: null,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: {
          street: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: language === 'sr' ? 'Srbija' : 'Serbia',
        },
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          title: item.name,
        })),
        totalAmount: totalPrice,
        status: 'pending',
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        notes: null,
      };

      // Save order to database
      const createdOrder = await OrderService.createOrder(orderData);
      
      // Create an admin notification for the new order
      await createNotification(
        language === 'sr' ? 'Nova porudžbina' : 'New Order Received', 
        language === 'sr' 
          ? `Porudžbina #${createdOrder.id.substring(0, 8)} je primljena u iznosu od ${totalPrice} RSD` 
          : `Order #${createdOrder.id.substring(0, 8)} has been placed for ${totalPrice} RSD`, 
        'info',
        '/admin/orders'
      );

      // Clear the cart
      clearCart();
      
      // Show success toast
      toast({
        title: translations.orderSuccess[language],
        description: translations.orderSuccessMessage[language],
        variant: "default",
      });
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: language === 'sr' ? "Greška" : "Error",
        description: language === 'sr' ? "Došlo je do greške prilikom kreiranja porudžbine" : "There was an error placing your order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-6">{translations.checkout[language]}</h1>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">{translations.personalInfo[language]}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.fullName[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.email[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.phone[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="+381 64 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.address[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.city[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="Belgrade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.postalCode[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="11000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{translations.paymentMethod[language]}</h2>
                  <div className="bg-muted/50 p-4 rounded-lg border flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{translations.cashOnDelivery[language]}</h3>
                      <p className="text-sm text-muted-foreground">{translations.cashOnDeliveryInfo[language]}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{translations.captchaVerification[language]}</h2>
                  <p className="text-sm text-muted-foreground">
                    {translations.captchaInfo[language]}
                  </p>
                  
                  <Captcha onVerify={setIsCaptchaVerified} />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <Button asChild variant="outline">
                    <Link to="/cart" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      {translations.backToCart[language]}
                    </Link>
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="gap-2"
                    disabled={isProcessing || !isCaptchaVerified}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        {translations.placeOrder[language]}...
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        {translations.placeOrder[language]}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="bg-card border rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4">{translations.checkout[language]}</h2>
              
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  {totalItems} {translations.itemsInCart[language]}
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 bg-muted rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-muted-foreground text-xs">No img</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-muted-foreground">{item.quantity} × {item.price.toLocaleString()} {translations.currency[language]}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 text-lg font-bold">
                  {translations.total[language]} {totalPrice.toLocaleString()} {translations.currency[language]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </MainLayout>
  );
};

export default Checkout;
