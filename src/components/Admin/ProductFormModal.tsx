
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Upload } from 'lucide-react';

// Define types for our form
export interface ProductFormData {
  id?: string;
  name: string;
  nameSr: string;
  nameEn: string;
  sku: string;
  category: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  status: 'active' | 'outOfStock' | 'draft';
  description: string;
  descriptionSr: string;
  descriptionEn: string;
  isNew: boolean;
  isOnSale: boolean;
  image: string;
}

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductFormData) => void;
  product?: Partial<ProductFormData>;
  isEditing?: boolean;
}

// Categories for the select dropdown
const CATEGORIES = [
  { value: 'phone-cases', labelEn: 'Phone Cases', labelSr: 'Maske za telefone' },
  { value: 'screen-protectors', labelEn: 'Screen Protectors', labelSr: 'Zaštita ekrana' },
  { value: 'chargers', labelEn: 'Chargers', labelSr: 'Punjači' },
  { value: 'cables', labelEn: 'Cables', labelSr: 'Kablovi' },
  { value: 'headphones', labelEn: 'Headphones', labelSr: 'Slušalice' },
  { value: 'adapters', labelEn: 'Adapters', labelSr: 'Adapteri' },
  { value: 'power-banks', labelEn: 'Power Banks', labelSr: 'Eksterna baterija' },
  { value: 'speakers', labelEn: 'Speakers', labelSr: 'Zvučnici' },
  { value: 'accessories', labelEn: 'Accessories', labelSr: 'Dodatna oprema' },
];

const STATUS_OPTIONS = [
  { value: 'active', labelEn: 'Active', labelSr: 'Aktivno' },
  { value: 'outOfStock', labelEn: 'Out of Stock', labelSr: 'Nema na stanju' },
  { value: 'draft', labelEn: 'Draft', labelSr: 'Nacrt' },
];

// Form validation schema
const productFormSchema = z.object({
  nameSr: z.string().min(3, { message: "Ime mora imati najmanje 3 karaktera" }),
  nameEn: z.string().min(3, { message: "Name must be at least 3 characters" }),
  sku: z.string().min(3, { message: "SKU mora imati najmanje 3 karaktera" }),
  category: z.string().min(1, { message: "Izaberite kategoriju" }),
  price: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0, { message: "Cena mora biti pozitivan broj" })
  ),
  oldPrice: z.preprocess(
    (val) => (val === '' || val === null ? null : Number(val)),
    z.number().nullable().optional()
  ),
  stock: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0, { message: "Količina mora biti pozitivan broj" })
  ),
  status: z.enum(['active', 'outOfStock', 'draft']),
  descriptionSr: z.string().optional(),
  descriptionEn: z.string().optional(),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  image: z.string().optional(),
});

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  onOpenChange,
  onSave,
  product = {},
  isEditing = false,
}) => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(product.image || null);

  // Initialize the form with default values or existing product data
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      nameSr: product.nameSr || product.name || '',
      nameEn: product.nameEn || product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      price: product.price || 0,
      oldPrice: product.oldPrice || null,
      stock: product.stock || 0,
      status: product.status || 'active',
      descriptionSr: product.descriptionSr || product.description || '',
      descriptionEn: product.descriptionEn || product.description || '',
      isNew: product.isNew || false,
      isOnSale: product.isOnSale || false,
      image: product.image || '',
    }
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof productFormSchema>) => {
    // Construct the full product data - ensuring all required properties are set
    const productData: ProductFormData = {
      id: product.id,
      name: language === 'sr' ? values.nameSr : values.nameEn,
      nameSr: values.nameSr,
      nameEn: values.nameEn,
      sku: values.sku,
      category: values.category,
      price: values.price,
      oldPrice: values.oldPrice,
      stock: values.stock,
      status: values.status,
      description: language === 'sr' ? values.descriptionSr : values.descriptionEn,
      descriptionSr: values.descriptionSr || '',
      descriptionEn: values.descriptionEn || '',
      isNew: values.isNew,
      isOnSale: values.isOnSale,
      image: values.image || ''
    };
    
    onSave(productData);
    toast({
      title: isEditing ? t('productUpdated') : t('productAdded'),
      description: isEditing 
        ? language === 'sr' ? 'Proizvod je uspešno ažuriran.' : 'Product has been successfully updated.' 
        : language === 'sr' ? 'Novi proizvod je uspešno dodat.' : 'New product has been successfully added.',
    });
    
    onOpenChange(false);
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to a server/CDN
      // For now, we'll use a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      form.setValue('image', imageUrl);
    }
  };

  // Clear image
  const clearImage = () => {
    setImagePreview(null);
    form.setValue('image', '');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? language === 'sr' ? 'Izmeni proizvod' : 'Edit Product' 
              : language === 'sr' ? 'Dodaj novi proizvod' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Serbian Name */}
              <FormField
                control={form.control}
                name="nameSr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Naziv (srpski)' : 'Name (Serbian)'}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'sr' ? 'Unesite naziv...' : 'Enter name...'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* English Name */}
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Naziv (engleski)' : 'Name (English)'}</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'sr' ? 'Unesite naziv...' : 'Enter name...'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* SKU */}
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder={language === 'sr' ? 'Unesite SKU...' : 'Enter SKU...'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Kategorija' : 'Category'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'sr' ? 'Izaberite kategoriju' : 'Select category'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {language === 'sr' ? category.labelSr : category.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Cena' : 'Price'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Old Price */}
              <FormField
                control={form.control}
                name="oldPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Stara cena' : 'Old Price'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        value={field.value || ''} 
                        onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>
                      {language === 'sr' ? 'Ostavite prazno ako nema stare cene' : 'Leave empty if there is no old price'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Stock */}
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Količina na stanju' : 'Stock'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'sr' ? 'Status' : 'Status'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'sr' ? 'Izaberite status' : 'Select status'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map(status => (
                          <SelectItem key={status.value} value={status.value}>
                            {language === 'sr' ? status.labelSr : status.labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
              
            {/* Product Image */}
            <div className="space-y-2">
              <Label>{language === 'sr' ? 'Slika proizvoda' : 'Product Image'}</Label>
              <div className="flex items-start gap-4">
                {imagePreview ? (
                  <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-muted">
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={clearImage} 
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center bg-muted">
                    <Upload size={24} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input 
                    type="file" 
                    id="product-image" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('product-image')?.click()}
                    className="w-full"
                  >
                    {language === 'sr' ? 'Otpremi sliku' : 'Upload Image'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    {language === 'sr' 
                      ? 'Preporučena veličina: 500x500px, max 2MB' 
                      : 'Recommended size: 500x500px, max 2MB'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Serbian Description */}
            <FormField
              control={form.control}
              name="descriptionSr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'sr' ? 'Opis (srpski)' : 'Description (Serbian)'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'sr' ? 'Unesite opis proizvoda...' : 'Enter product description...'}
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* English Description */}
            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'sr' ? 'Opis (engleski)' : 'Description (English)'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'sr' ? 'Unesite opis proizvoda...' : 'Enter product description...'}
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Flags */}
            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="isNew"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{language === 'sr' ? 'Novi proizvod' : 'New Product'}</FormLabel>
                      <FormDescription>
                        {language === 'sr' 
                          ? 'Označite ako je ovo novi proizvod' 
                          : 'Check if this is a new product'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isOnSale"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{language === 'sr' ? 'Na akciji' : 'On Sale'}</FormLabel>
                      <FormDescription>
                        {language === 'sr' 
                          ? 'Označite ako je proizvod na popustu' 
                          : 'Check if product is on sale'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {language === 'sr' ? 'Otkaži' : 'Cancel'}
              </Button>
              <Button type="submit">
                {isEditing 
                  ? language === 'sr' ? 'Sačuvaj izmene' : 'Save Changes' 
                  : language === 'sr' ? 'Dodaj proizvod' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
