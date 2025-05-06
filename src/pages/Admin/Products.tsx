import React, { useState, useEffect } from 'react';
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
import { ProductFormModal, ProductFormData } from '@/components/Admin/ProductFormModal';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminProduct } from '@/services/ProductService';
import { SupabaseProductService } from '@/services/SupabaseProductService';
import { SupabaseCategoryService } from '@/services/SupabaseCategoryService';

const Products: React.FC = () => {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState('');
  const [currentProduct, setCurrentProduct] = useState<ProductFormData | null>(null);
  
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      console.log('Loading products...');
      const allProducts = await SupabaseProductService.getAdminProducts();
      console.log('Products loaded:', allProducts.length);
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' ? 'Greška pri učitavanju proizvoda' : 'Error loading products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadCategories = async () => {
    try {
      const allCategories = await SupabaseCategoryService.getCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' ? 'Greška pri učitavanju kategorija' : 'Error loading categories',
        variant: 'destructive'
      });
    }
  };
  
  const filteredProducts = products.filter(product => 
    product.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
  
  const handleEditProduct = (product: AdminProduct) => {
    const productFormData: ProductFormData = {
      id: product.id,
      name: product.title[language],
      nameSr: product.title.sr,
      nameEn: product.title.en,
      sku: product.sku,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || null,
      stock: product.stock,
      status: product.status,
      description: product.description || '',
      descriptionSr: product.descriptionSr || '',
      descriptionEn: product.descriptionEn || '',
      isNew: product.isNew,
      isOnSale: product.isOnSale,
      image: product.image
    };
    
    setCurrentProduct(productFormData);
    setIsEditProductModalOpen(true);
  };
  
  const handleDeleteProduct = (product: AdminProduct) => {
    const productFormData: ProductFormData = {
      id: product.id,
      name: product.title[language],
      nameSr: product.title.sr,
      nameEn: product.title.en,
      sku: product.sku,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || null,
      stock: product.stock,
      status: product.status,
      description: product.description || '',
      descriptionSr: product.descriptionSr || '',
      descriptionEn: product.descriptionEn || '',
      isNew: product.isNew,
      isOnSale: product.isOnSale,
      image: product.image
    };
    
    setCurrentProduct(productFormData);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteProduct = async () => {
    if (currentProduct?.id) {
      try {
        const success = await SupabaseProductService.deleteProduct(currentProduct.id);
        
        if (success) {
          setSelectedProducts(prev => 
            prev.filter(id => id !== currentProduct.id)
          );
          
          toast({
            title: language === 'sr' ? 'Proizvod obrisan' : 'Product Deleted',
            description: language === 'sr' 
              ? `Proizvod "${currentProduct.name}" je uspešno obrisan.` 
              : `Product "${currentProduct.name}" has been successfully deleted.`,
          });
          
          loadProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? `Greška pri brisanju proizvoda "${currentProduct.name}".` 
            : `Error deleting product "${currentProduct.name}".`,
          variant: 'destructive'
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setCurrentProduct(null);
  };
  
  const handleSaveProduct = async (productData: ProductFormData) => {
    setLoading(true);
    try {
      console.log('Saving product:', productData);
      
      if (productData.id) {
        // Update existing product
        await SupabaseProductService.updateProduct(productData.id, productData);
        toast({
          title: language === 'sr' ? 'Proizvod ažuriran' : 'Product Updated',
          description: language === 'sr' 
            ? `Proizvod "${productData.name}" je uspešno ažuriran.` 
            : `Product "${productData.name}" has been successfully updated.`,
        });
      } else {
        // Create new product
        console.log('Creating new product with data:', productData);
        const newProduct = await SupabaseProductService.createProduct(productData);
        console.log('New product created:', newProduct);
        
        toast({
          title: language === 'sr' ? 'Proizvod dodat' : 'Product Added',
          description: language === 'sr' 
            ? `Proizvod "${productData.name}" je uspešno dodat.` 
            : `Product "${productData.name}" has been successfully added.`,
        });
      }
      
      // Reload products to reflect changes
      await loadProducts();
      
      // Close any open modals
      setIsAddProductModalOpen(false);
      setIsEditProductModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? `Greška pri čuvanju proizvoda "${productData.name}". ${(error as Error).message}` 
          : `Error saving product "${productData.name}". ${(error as Error).message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteSelected = async () => {
    if (selectedProducts.length > 0) {
      try {
        const success = await SupabaseProductService.bulkDeleteProducts(selectedProducts);
        
        if (success) {
          toast({
            title: language === 'sr' ? 'Proizvodi obrisani' : 'Products Deleted',
            description: language === 'sr' 
              ? `${selectedProducts.length} proizvoda je uspešno obrisano.` 
              : `${selectedProducts.length} products have been successfully deleted.`,
          });
          
          setSelectedProducts([]);
          
          loadProducts();
        }
      } catch (error) {
        console.error('Error deleting products:', error);
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Greška pri brisanju proizvoda.' 
            : 'Error deleting products.',
          variant: 'destructive'
        });
      }
    }
  };
  
  const handleExportProducts = async () => {
    try {
      const exportData = await SupabaseProductService.exportProducts();
      
      const blob = new Blob([exportData], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-export.json';
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: language === 'sr' ? 'Izvoz uspešan' : 'Export Successful',
        description: language === 'sr' 
          ? 'Proizvodi su uspešno izvezeni.' 
          : 'Products have been successfully exported.',
      });
    } catch (error) {
      console.error('Error exporting products:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Greška pri izvozu proizvoda.' 
          : 'Error exporting products.',
        variant: 'destructive'
      });
    }
  };
  
  const handleOpenImportDialog = () => {
    setImportData('');
    setIsImportDialogOpen(true);
  };
  
  const handleImportProducts = async () => {
    if (!importData.trim()) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Unesite podatke za uvoz.' 
          : 'Please enter import data.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const success = await SupabaseProductService.importProducts(importData);
      
      if (success) {
        toast({
          title: language === 'sr' ? 'Uvoz uspešan' : 'Import Successful',
          description: language === 'sr' 
            ? 'Proizvodi su uspešno uvezeni.' 
            : 'Products have been successfully imported.',
        });
        
        loadProducts();
        setIsImportDialogOpen(false);
      }
    } catch (error) {
      console.error('Error importing products:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Greška pri uvozu proizvoda. Proverite format podataka.' 
          : 'Error importing products. Please check the data format.',
        variant: 'destructive'
      });
    }
  };

  const getCategoryLabel = (categorySlug: string) => {
    const category = categories.find(cat => cat.slug === categorySlug);
    if (category) {
      return language === 'sr' ? category.name.sr : category.name.en;
    }
    return categorySlug;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">{language === 'sr' ? 'Proizvodi' : 'Products'}</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleOpenImportDialog}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {language === 'sr' ? 'Uvezi' : 'Import'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleExportProducts}
          >
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      {language === 'sr' ? 'Učitavanje proizvoda...' : 'Loading products...'}
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
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
                            src={product.image || '/placeholder.svg'} 
                            alt={product.title[language]} 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.title[language]}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{getCategoryLabel(product.category)}</TableCell>
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
      
      <ProductFormModal
        open={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
        onSave={handleSaveProduct}
        isEditing={false}
        categories={categories}
      />
      
      <ProductFormModal
        open={isEditProductModalOpen}
        onOpenChange={setIsEditProductModalOpen}
        onSave={handleSaveProduct}
        product={currentProduct || undefined}
        isEditing={true}
        categories={categories}
      />
      
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
      
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {language === 'sr' ? 'Uvezi proizvode' : 'Import Products'}
            </DialogTitle>
            <DialogDescription>
              {language === 'sr' 
                ? 'Unesite JSON podatke za uvoz proizvoda.' 
                : 'Enter JSON data to import products.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              className="min-h-[200px] font-mono text-sm"
              placeholder={language === 'sr' ? 'Zalemite JSON podatke ovde...' : 'Paste JSON data here...'}
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {language === 'sr' 
                ? 'Podaci moraju biti u ispravnom JSON formatu.' 
                : 'Data must be in valid JSON format.'}
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              {language === 'sr' ? 'Otkaži' : 'Cancel'}
            </Button>
            <Button type="button" onClick={handleImportProducts}>
              {language === 'sr' ? 'Uvezi' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
