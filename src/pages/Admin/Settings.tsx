
import React, { useState } from 'react';
import { 
  Save,
  Smartphone,
  Mail,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  CreditCard,
  Truck,
  Banknote,
  Settings as SettingsIcon,
  ShieldCheck,
  LanguagesIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Mock settings data
const mockSettings = {
  general: {
    siteName: 'MobiShop',
    siteDescription: 'Premium mobile accessories store',
    email: 'info@mobishop.rs',
    phone: '+381 11 123 4567',
    address: 'Bulevar Kralja Aleksandra 73, 11000 Beograd',
    logo: 'https://images.unsplash.com/photo-1586078845905-c530fc1d56f7?w=150&auto=format&fit=crop',
    favicon: 'https://images.unsplash.com/photo-1586078845905-c530fc1d56f7?w=32&auto=format&fit=crop',
  },
  localization: {
    defaultLanguage: 'sr',
    availableLanguages: ['sr', 'en'],
    defaultCurrency: 'RSD',
    currencySymbol: 'RSD',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
  },
  social: {
    facebook: 'https://facebook.com/mobishop',
    instagram: 'https://instagram.com/mobishop',
    twitter: 'https://twitter.com/mobishop',
    youtube: 'https://youtube.com/mobishop',
  },
  payment: {
    cashOnDelivery: true,
    bankTransfer: true,
    creditCard: false,
    paypal: false,
  },
  shipping: {
    freeShippingThreshold: 5000,
    deliveryTimeDays: '1-3',
    enableLocalPickup: true,
    shippingPrice: 400,
  },
  seo: {
    metaTitle: 'MobiShop - Premium mobile accessories',
    metaDescription: 'Buy premium quality mobile accessories, phone cases, chargers, screen protectors and more. Fast shipping across Serbia.',
    ogImage: 'https://images.unsplash.com/photo-1586078845905-c530fc1d56f7?w=1200&auto=format&fit=crop',
    enableSitemap: true,
    googleAnalyticsId: 'G-XXXXXXXXXX',
  },
  features: {
    enableReviews: true,
    enableWishlist: true,
    enableCompare: false,
    enableFeaturedProducts: true,
    enableNewArrivals: true,
    enableBestSellers: true,
  }
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [settings, setSettings] = useState(mockSettings);
  const { toast } = useToast();
  
  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const handleSave = () => {
    // In a real app, this would save settings to a database
    console.log('Saving settings:', settings);
    toast({
      title: "Settings saved",
      description: "Your changes have been successfully saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Store Settings</h1>
        
        <Button onClick={handleSave} className="flex items-center">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
          <TabsTrigger value="general" className="flex flex-col items-center py-2 h-auto">
            <SettingsIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">General</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex flex-col items-center py-2 h-auto">
            <LanguagesIcon className="h-4 w-4 mb-1" />
            <span className="text-xs">Localization</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex flex-col items-center py-2 h-auto">
            <Globe className="h-4 w-4 mb-1" />
            <span className="text-xs">Social</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex flex-col items-center py-2 h-auto">
            <CreditCard className="h-4 w-4 mb-1" />
            <span className="text-xs">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex flex-col items-center py-2 h-auto">
            <Truck className="h-4 w-4 mb-1" />
            <span className="text-xs">Shipping</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex flex-col items-center py-2 h-auto">
            <ShieldCheck className="h-4 w-4 mb-1" />
            <span className="text-xs">Features</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Store Name</Label>
                    <Input 
                      id="siteName" 
                      value={settings.general.siteName}
                      onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="siteDescription">Store Description</Label>
                    <Textarea 
                      id="siteDescription" 
                      value={settings.general.siteDescription}
                      onChange={(e) => handleChange('general', 'siteDescription', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={settings.general.email}
                        onChange={(e) => handleChange('general', 'email', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        value={settings.general.phone}
                        onChange={(e) => handleChange('general', 'phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Store Address</Label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="address" 
                        value={settings.general.address}
                        onChange={(e) => handleChange('general', 'address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Store Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-md border overflow-hidden bg-secondary flex items-center justify-center">
                        {settings.general.logo ? (
                          <img 
                            src={settings.general.logo} 
                            alt="Store logo" 
                            className="h-full w-full object-contain" 
                          />
                        ) : (
                          <Smartphone className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <Button variant="outline">Change Logo</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended size: 200x60 pixels, PNG or SVG format
                    </p>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Favicon</Label>
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-md border overflow-hidden bg-secondary flex items-center justify-center">
                        {settings.general.favicon ? (
                          <img 
                            src={settings.general.favicon} 
                            alt="Favicon" 
                            className="h-full w-full object-contain" 
                          />
                        ) : (
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <Button variant="outline">Change Favicon</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended size: 32x32 pixels, PNG or ICO format
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Localization Settings */}
        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>
                Configure language, currency, and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select 
                    value={settings.localization.defaultLanguage}
                    onValueChange={(value) => handleChange('localization', 'defaultLanguage', value)}
                  >
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sr">Serbian (Srpski)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select 
                    value={settings.localization.defaultCurrency}
                    onValueChange={(value) => handleChange('localization', 'defaultCurrency', value)}
                  >
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RSD">Serbian Dinar (RSD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input 
                    id="currencySymbol" 
                    value={settings.localization.currencySymbol}
                    onChange={(e) => handleChange('localization', 'currencySymbol', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={settings.localization.dateFormat}
                    onValueChange={(value) => handleChange('localization', 'dateFormat', value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select 
                    value={settings.localization.timeFormat}
                    onValueChange={(value) => handleChange('localization', 'timeFormat', value)}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-hour (14:30)</SelectItem>
                      <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Available Languages</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.localization.availableLanguages.includes('sr')}
                        onCheckedChange={(checked) => {
                          const langs = checked 
                            ? [...settings.localization.availableLanguages, 'sr']
                            : settings.localization.availableLanguages.filter(l => l !== 'sr');
                          handleChange('localization', 'availableLanguages', langs);
                        }}
                        id="lang-sr"
                      />
                      <Label htmlFor="lang-sr">Serbian (Srpski)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={settings.localization.availableLanguages.includes('en')}
                        onCheckedChange={(checked) => {
                          const langs = checked 
                            ? [...settings.localization.availableLanguages, 'en']
                            : settings.localization.availableLanguages.filter(l => l !== 'en');
                          handleChange('localization', 'availableLanguages', langs);
                        }}
                        id="lang-en"
                      />
                      <Label htmlFor="lang-en">English</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Social Media Settings */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect your store with social media platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex items-center space-x-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <Input 
                      id="facebook" 
                      value={settings.social.facebook}
                      onChange={(e) => handleChange('social', 'facebook', e.target.value)}
                      placeholder="https://facebook.com/yourbusiness"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <Input 
                      id="instagram" 
                      value={settings.social.instagram}
                      onChange={(e) => handleChange('social', 'instagram', e.target.value)}
                      placeholder="https://instagram.com/yourbusiness"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex items-center space-x-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    <Input 
                      id="twitter" 
                      value={settings.social.twitter}
                      onChange={(e) => handleChange('social', 'twitter', e.target.value)}
                      placeholder="https://twitter.com/yourbusiness"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="youtube">YouTube</Label>
                  <div className="flex items-center space-x-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    <Input 
                      id="youtube" 
                      value={settings.social.youtube}
                      onChange={(e) => handleChange('social', 'youtube', e.target.value)}
                      placeholder="https://youtube.com/yourbusiness"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure available payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center">
                    <Banknote className="h-6 w-6 mr-3 text-green-600" />
                    <div>
                      <h3 className="font-medium">Cash on Delivery</h3>
                      <p className="text-sm text-muted-foreground">Accept cash payment when product is delivered</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.payment.cashOnDelivery}
                    onCheckedChange={(checked) => handleChange('payment', 'cashOnDelivery', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
                    <div>
                      <h3 className="font-medium">Bank Transfer</h3>
                      <p className="text-sm text-muted-foreground">Accept payments via bank transfer</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.payment.bankTransfer}
                    onCheckedChange={(checked) => handleChange('payment', 'bankTransfer', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 mr-3 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Credit Card</h3>
                      <p className="text-sm text-muted-foreground">Accept credit card payments online</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings.payment.creditCard}
                    onCheckedChange={(checked) => handleChange('payment', 'creditCard', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Options</CardTitle>
              <CardDescription>
                Configure shipping methods and delivery options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="shippingPrice">Standard Shipping Price (RSD)</Label>
                  <Input 
                    id="shippingPrice" 
                    type="number"
                    value={settings.shipping.shippingPrice}
                    onChange={(e) => handleChange('shipping', 'shippingPrice', Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (RSD)</Label>
                  <Input 
                    id="freeShippingThreshold" 
                    type="number"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) => handleChange('shipping', 'freeShippingThreshold', Number(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Orders above this amount qualify for free shipping
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="deliveryTimeDays">Estimated Delivery Time (days)</Label>
                  <Input 
                    id="deliveryTimeDays" 
                    value={settings.shipping.deliveryTimeDays}
                    onChange={(e) => handleChange('shipping', 'deliveryTimeDays', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableLocalPickup"
                    checked={settings.shipping.enableLocalPickup}
                    onCheckedChange={(checked) => handleChange('shipping', 'enableLocalPickup', checked)}
                  />
                  <div>
                    <Label htmlFor="enableLocalPickup">Enable Local Pickup</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow customers to pick up orders at your store
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Features Settings */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Store Features</CardTitle>
              <CardDescription>
                Enable or disable store features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableReviews"
                    checked={settings.features.enableReviews}
                    onCheckedChange={(checked) => handleChange('features', 'enableReviews', checked)}
                  />
                  <Label htmlFor="enableReviews">Enable Product Reviews</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableWishlist"
                    checked={settings.features.enableWishlist}
                    onCheckedChange={(checked) => handleChange('features', 'enableWishlist', checked)}
                  />
                  <Label htmlFor="enableWishlist">Enable Wishlist</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableCompare"
                    checked={settings.features.enableCompare}
                    onCheckedChange={(checked) => handleChange('features', 'enableCompare', checked)}
                  />
                  <Label htmlFor="enableCompare">Enable Product Comparison</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableFeaturedProducts"
                    checked={settings.features.enableFeaturedProducts}
                    onCheckedChange={(checked) => handleChange('features', 'enableFeaturedProducts', checked)}
                  />
                  <Label htmlFor="enableFeaturedProducts">Show Featured Products</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableNewArrivals"
                    checked={settings.features.enableNewArrivals}
                    onCheckedChange={(checked) => handleChange('features', 'enableNewArrivals', checked)}
                  />
                  <Label htmlFor="enableNewArrivals">Show New Arrivals</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="enableBestSellers"
                    checked={settings.features.enableBestSellers}
                    onCheckedChange={(checked) => handleChange('features', 'enableBestSellers', checked)}
                  />
                  <Label htmlFor="enableBestSellers">Show Best Sellers</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
