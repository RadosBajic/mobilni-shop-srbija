
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileUp, 
  FileDown,
  Edit,
  Trash2,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';
import { ProductFormModal } from '@/components/Admin/ProductFormModal';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';

// Mock product data
const mockProducts: ProductFormData[] = [
  {
    id: 'p1',
    name: 'iPhone 14 Pro silikonska maska - crna',
    nameSr: 'iPhone 14 Pro silikonska maska - crna',
    nameEn: 'iPhone 14 Pro silicone case - black',
    sku: 'IP14P-CASE-BLK',
    category: 'phone-cases',
    price: 2499,
    stock: 45,
    status: 'active',
    description: 'Kvalitetna silikonska maska za iPhone 14 Pro',
    descriptionSr: 'Kvalitetna silikonska maska za iPhone 14 Pro',
    descriptionEn: 'Quality silicone case for iPhone 14 Pro',
    image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=100&auto=format&fit=crop',
    isNew: true,
    isOnSale: true,
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
    nameSr: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
    nameEn: 'Samsung Galaxy S23 Ultra glass screen protector',
    sku: 'SGS23U-SCRN',
    category: 'screen-protectors',
    price: 1499,
    stock: 32,
    status: 'active',
    description: 'Zaštitno staklo za Samsung Galaxy S23 Ultra',
    descriptionSr: 'Zaštitno staklo za Samsung Galaxy S23 Ultra',
    descriptionEn: 'Protective glass for Samsung Galaxy S23 Ultra',
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=100&auto=format&fit=crop',
    isNew: true,
    isOnSale: false,
  },
  {
    id: 'p3',
    name: 'Bežične Bluetooth slušalice sa mikrofonom',
    nameSr: 'Bežične Bluetooth slušalice sa mikrofonom',
    nameEn: 'Wireless Bluetooth headphones with microphone',
    sku: 'BT-EARBUD-BLK',
    category: 'headphones',
    price: 4999,
    stock: 18,
    status: 'active',
    description: 'Bežične slušalice sa Bluetooth tehnologijom',
    descriptionSr: 'Bežične slušalice sa Bluetooth tehnologijom',
    descriptionEn: 'Wireless headphones with Bluetooth technology',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=100&auto=format&fit=crop',
    isNew: false,
    isOnSale: true,
  },
  {
    id: 'p4',
    name: 'Brzi punjač USB-C 65W',
    nameSr: 'Brzi punjač USB-C 65W',
    nameEn: 'Fast charger USB-C 65W',
    sku: 'CHR-USB-C-65',
    category: 'chargers',
    price: 3499,
    stock: 27,
    status: 'active',
    description: 'Brzi punjač sa USB-C priključkom',
    descriptionSr: 'Brzi punjač sa USB-C priključkom',
    descriptionEn: 'Fast charger with USB-C connector',
    image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?q=80&w=100&auto=format&fit=crop',
    isNew: false,
    isOnSale: false,
  },
  {
    id: 'p5',
    name: 'Premium Lightning kabl - 2m',
    nameSr: 'Premium Lightning kabl - 2m',
    nameEn: 'Premium Lightning cable - 2m',
    sku: 'CBL-LIGHT-2M',
    category: 'cables',
    price: 1299,
    stock: 0,
    status: 'outOfStock',
    description: 'Premium Lightning kabl dužine 2 metra',
    descriptionSr: 'Premium Lightning kabl dužine 2 metra',
    descriptionEn: 'Premium Lightning cable 2 meters long',
    image: 'https://images.unsplash.com/photo-1606292943133-cc1b0ff0e295?q=80&w=100&auto=format&fit=crop',
    isNew: false,
    isOnSale: true,
  },
  {
    id: 'p6',
    name: 'Xiaomi Redmi Note 12 transparentna maska',
    nameSr: 'Xiaomi Redmi Note 12 transparentna maska',
    nameEn: 'Xiaomi Redmi Note 12 transparent case',
    sku: 'XRM12-CASE-CLR',
    category: 'phone-cases',
    price: 1199,
    stock: 12,
    status: 'active',
    description: 'Transparentna maska za Xiaomi Redmi Note 12',
    descriptionSr: 'Transparentna maska za Xiaomi Redmi Note 12',
    descriptionEn: 'Transparent case for Xiaomi Redmi Note 12',
    image: 'https://images.unsplash.com/photo-1609388449750-b504ef6d27f4?q=80&w=100&auto=format&fit=crop',
    isNew: true,
    isOnSale: false,
  },
  {
    id: 'p7',
    name: 'Zaštitno staklo za Apple Watch',
    nameSr: 'Zaštitno staklo za Apple Watch',
    nameEn: 'Protective glass for Apple Watch',
    sku: 'AW-SCRN-42MM',
    category: 'screen-protectors',
    price: 1299,
    stock: 0,
    status: 'draft',
    description: 'Zaštitno staklo za Apple Watch',
    descriptionSr: 'Zaštitno staklo za Apple Watch',
    descriptionEn: 'Protective glass for Apple Watch',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=100&auto=format&fit=crop',
    isNew: false,
    isOnSale: true,
  },
];

interface ProductFormData {
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

const Products: React.FC = () => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductFormData[]>(mockProducts);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would be implemented here in a real app
    console.log('Searching for:', searchTerm);
  };
  
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id || ''));
    }
  };
  
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsAddProductModalOpen(true);
  };
  
  const handleEditProduct = (product: ProductFormData) => {
    setCurrentProduct(product);
    setIsEditProductModalOpen(true);
  };
  
  const handleDeleteProduct = (product: ProductFormData) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteProduct = () => {
    if (currentProduct?.id) {
      // Filter out the product to be deleted
      setProducts(prevProducts => 
        prevProducts.filter(p => p.id !== currentProduct.id)
      );
      
      // Remove from selected products if it was selected
      setSelectedProducts(prev => 
        prev.filter(id => id !== currentProduct.id)
      );
      
      toast({
        title: language === 'sr' ? 'Proizvod obrisan' : 'Product Deleted',
        description: language === 'sr' 
          ? `Proizvod "${currentProduct.name}" je uspešno obrisan.` 
          : `Product "${currentProduct.name}" has been successfully deleted.`,
      });
    }
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };
  
  const handleSaveProduct = (productData: ProductFormData) => {
    if (productData.id) {
      // Update existing product
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === productData.id ? { ...productData } : p
        )
      );
    } else {
      // Add new product with a generated ID
      const newProduct = {
        ...productData,
        id: `p${products.length + 1}`,
      };
      setProducts(prevProducts => [...prevProducts, newProduct]);
    }
  };
  
  // Handle bulk delete
  const handleDeleteSelected = () => {
    if (selectedProducts.length > 0) {
      setProducts(prevProducts => 
        prevProducts.filter(p => !selectedProducts.includes(p.id || ''))
      );
      
      toast({
        title: language === 'sr' ? 'Proizvodi obrisani' : 'Products Deleted',
        description: language === 'sr' 
          ? `${selectedProducts.length} proizvoda je uspešno obrisano.` 
          : `${selectedProducts.length} products have been successfully deleted.`,
      });
      
      setSelectedProducts([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{language === 'sr' ? 'Proizvodi' : 'Products'}</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <FileUp className="mr-2 h-4 w-4" />
            {language === 'sr' ? 'Uvezi' : 'Import'}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <FileDown className="mr-2 h-4 w-4" />
            {language === 'sr' ? 'Izvezi' : 'Export'}
          </Button>
          <Button 
            size="sm" 
            className="flex items-center"
            onClick={handleAddProduct}
          >
            <Plus className="mr-2 h-4 w-4" />
            {language === 'sr' ? 'Dodaj proizvod' : 'Add Product'}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder={language === 'sr' ? "Pretraži proizvode..." : "Search products..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </form>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    {language === 'sr' ? 'Filter' : 'Filter'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{language === 'sr' ? 'Filtriraj po' : 'Filter By'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    {language === 'sr' ? 'Aktivno' : 'Active'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    {language === 'sr' ? 'Nema na stanju' : 'Out of Stock'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4 opacity-0" />
                    {language === 'sr' ? 'Nacrt' : 'Draft'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {language === 'sr' ? 'Resetuj filtere' : 'Reset Filters'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Selected products actions */}
          {selectedProducts.length > 0 && (
            <div className="p-2 bg-muted/50 border-b flex items-center justify-between">
              <div className="text-sm pl-2">
                {language === 'sr' 
                  ? `${selectedProducts.length} proizvoda izabrano` 
                  : `${selectedProducts.length} products selected`}
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {language === 'sr' ? 'Obriši izabrano' : 'Delete Selected'}
              </Button>
            </div>
          )}
          
          {/* Products table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-14"></TableHead>
                  <TableHead>{language === 'sr' ? 'Proizvod' : 'Product'}</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>{language === 'sr' ? 'Kategorija' : 'Category'}</TableHead>
                  <TableHead className="text-right">{language === 'sr' ? 'Cena' : 'Price'}</TableHead>
                  <TableHead className="text-right">{language === 'sr' ? 'Stanje' : 'Stock'}</TableHead>
                  <TableHead className="text-right">{language === 'sr' ? 'Status' : 'Status'}</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {language === 'sr' ? 'Nema pronađenih proizvoda' : 'No products found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="group">
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedProducts.includes(product.id || '')}
                          onChange={() => toggleProductSelection(product.id || '')}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.price.toLocaleString()} RSD</TableCell>
                      <TableCell className="text-right">{product.stock}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={
                          product.status === 'active' ? 'default' :
                          product.status === 'outOfStock' ? 'destructive' : 'secondary'
                        }>
                          {product.status === 'active' 
                            ? language === 'sr' ? 'Aktivno' : 'Active'
                            : product.status === 'outOfStock' 
                              ? language === 'sr' ? 'Nema na stanju' : 'Out of Stock'
                              : language === 'sr' ? 'Nacrt' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Open menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {language === 'sr' ? 'Izmeni' : 'Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProduct(product)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {language === 'sr' ? 'Obriši' : 'Delete'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink href="#" aria-label="Previous page">
                    {language === 'sr' ? 'Prethodna' : 'Previous'}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" aria-label="Next page">
                    {language === 'sr' ? 'Sledeća' : 'Next'}
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Product Modal */}
      <ProductFormModal
        open={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
        onSave={handleSaveProduct}
        isEditing={false}
      />
      
      {/* Edit Product Modal */}
      <ProductFormModal
        open={isEditProductModalOpen}
        onOpenChange={setIsEditProductModalOpen}
        onSave={handleSaveProduct}
        product={currentProduct || undefined}
        isEditing={true}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'sr' ? 'Potvrdi brisanje' : 'Confirm Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'sr' 
                ? `Da li ste sigurni da želite da obrišete proizvod "${currentProduct?.name}"?` 
                : `Are you sure you want to delete the product "${currentProduct?.name}"?`}
              <br />
              {language === 'sr' 
                ? 'Ova radnja je nepovratna.' 
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'sr' ? 'Otkaži' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === 'sr' ? 'Obriši' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Products;
