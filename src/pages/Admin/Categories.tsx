
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown,
  ImagePlus,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { setupDatabase, initializeDatabase } from '@/utils/setupDatabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryType {
  id: string;
  name_sr: string;
  name_en: string;
  slug: string;
  description_sr: string | null;
  description_en: string | null;
  image: string | null;
  is_active: boolean;
  display_order: number;
  productCount?: number;
}

const Categories: React.FC = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  
  const [newCategory, setNewCategory] = useState({
    name_sr: '',
    name_en: '',
    slug: '',
    description_sr: '',
    description_en: '',
    image: '',
    is_active: true,
    display_order: 0
  });
  
  useEffect(() => {
    checkDatabaseAndLoadData();
  }, []);
  
  const checkDatabaseAndLoadData = async () => {
    try {
      const isReady = await setupDatabase();
      setDbStatus(isReady ? 'connected' : 'disconnected');
      
      if (isReady) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error checking database:', error);
      setDbStatus('disconnected');
    }
  };
  
  const initializeDb = async () => {
    setLoading(true);
    try {
      const success = await initializeDatabase();
      
      if (success) {
        toast({
          title: language === 'sr' ? 'Baza podataka inicijalizovana' : 'Database initialized',
          description: language === 'sr' 
            ? 'Baza podataka je uspešno inicijalizovana.' 
            : 'Database has been successfully initialized.',
        });
        
        setDbStatus('connected');
        fetchCategories();
      } else {
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Došlo je do greške pri inicijalizaciji baze podataka.' 
            : 'There was an error initializing the database.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Došlo je do greške pri inicijalizaciji baze podataka.' 
          : 'There was an error initializing the database.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      
      // For each category, get the product count
      const categoriesWithProductCounts = await Promise.all(data.map(async (category: CategoryType) => {
        try {
          const products = await api.getProducts({ category: category.slug });
          return {
            ...category,
            productCount: products.length
          };
        } catch (error) {
          console.error(`Error fetching products for category ${category.slug}:`, error);
          return {
            ...category,
            productCount: 0
          };
        }
      }));
      
      setCategories(categoriesWithProductCounts);
      setFilteredCategories(categoriesWithProductCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    
    if (query.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.name_sr.toLowerCase().includes(query.toLowerCase()) ||
        category.name_en.toLowerCase().includes(query.toLowerCase()) ||
        category.description_sr?.toLowerCase().includes(query.toLowerCase()) ||
        category.description_en?.toLowerCase().includes(query.toLowerCase()) ||
        category.slug.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };
  
  const handleCategoryChange = (field: string, value: string | boolean | number) => {
    setNewCategory(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };
      
      // Auto-generate slug from name_sr if the field is 'name_sr'
      if (field === 'name_sr' && typeof value === 'string') {
        updated.slug = value.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-');
      }
      
      return updated;
    });
  };

  const handleEditCategoryChange = (field: string, value: string | boolean | number) => {
    if (!editingCategory) return;
    
    setEditingCategory(prev => {
      if (!prev) return prev;
      
      const updated = {
        ...prev,
        [field]: value,
      };
      
      // Auto-generate slug from name_sr if the field is 'name_sr'
      if (field === 'name_sr' && typeof value === 'string') {
        updated.slug = value.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-');
      }
      
      return updated;
    });
  };
  
  const handleAddCategory = async () => {
    try {
      // Basic validation
      if (!newCategory.name_sr || !newCategory.name_en || !newCategory.slug) {
        toast({
          title: language === 'sr' ? 'Nedostaju podaci' : 'Missing data',
          description: language === 'sr' 
            ? 'Molimo popunite obavezna polja (naziv i slug).' 
            : 'Please fill in required fields (name and slug).',
          variant: 'destructive'
        });
        return;
      }
      
      // Validate uniqueness of slug
      const slugExists = categories.some(cat => cat.slug === newCategory.slug);
      if (slugExists) {
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Kategorija sa ovim slug-om već postoji.' 
            : 'Category with this slug already exists.',
          variant: 'destructive'
        });
        return;
      }
      
      // Create category
      const categoryData = {
        nameSr: newCategory.name_sr,
        nameEn: newCategory.name_en,
        slug: newCategory.slug,
        descriptionSr: newCategory.description_sr,
        descriptionEn: newCategory.description_en,
        image: newCategory.image,
        isActive: newCategory.is_active,
        displayOrder: newCategory.display_order || 0
      };
      
      const createdCategory = await api.createCategory(categoryData);
      
      // Update UI
      setCategories(prev => [...prev, { 
        ...createdCategory,
        productCount: 0
      }]);
      setFilteredCategories(prev => [...prev, { 
        ...createdCategory,
        productCount: 0
      }]);
      
      toast({
        title: language === 'sr' ? 'Kategorija kreirana' : 'Category created',
        description: language === 'sr' 
          ? 'Kategorija je uspešno kreirana.' 
          : 'Category has been successfully created.',
      });
      
      // Reset form and close dialog
      setNewCategory({
        name_sr: '',
        name_en: '',
        slug: '',
        description_sr: '',
        description_en: '',
        image: '',
        is_active: true,
        display_order: 0
      });
      setIsAddCategoryOpen(false);
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Došlo je do greške pri kreiranju kategorije.' 
          : 'There was an error creating the category.',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      // Basic validation
      if (!editingCategory.name_sr || !editingCategory.name_en || !editingCategory.slug) {
        toast({
          title: language === 'sr' ? 'Nedostaju podaci' : 'Missing data',
          description: language === 'sr' 
            ? 'Molimo popunite obavezna polja (naziv i slug).' 
            : 'Please fill in required fields (name and slug).',
          variant: 'destructive'
        });
        return;
      }
      
      // Validate uniqueness of slug
      const slugExists = categories.some(cat => cat.slug === editingCategory.slug && cat.id !== editingCategory.id);
      if (slugExists) {
        toast({
          title: language === 'sr' ? 'Greška' : 'Error',
          description: language === 'sr' 
            ? 'Kategorija sa ovim slug-om već postoji.' 
            : 'Category with this slug already exists.',
          variant: 'destructive'
        });
        return;
      }
      
      // Update category
      const categoryData = {
        nameSr: editingCategory.name_sr,
        nameEn: editingCategory.name_en,
        slug: editingCategory.slug,
        descriptionSr: editingCategory.description_sr || '',
        descriptionEn: editingCategory.description_en || '',
        image: editingCategory.image || '',
        isActive: editingCategory.is_active,
        displayOrder: editingCategory.display_order
      };
      
      await api.updateCategory(editingCategory.id, categoryData);
      
      // Update UI
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...editingCategory } 
          : cat
      ));
      setFilteredCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...editingCategory } 
          : cat
      ));
      
      toast({
        title: language === 'sr' ? 'Kategorija ažurirana' : 'Category updated',
        description: language === 'sr' 
          ? 'Kategorija je uspešno ažurirana.' 
          : 'Category has been successfully updated.',
      });
      
      // Reset and close dialog
      setEditingCategory(null);
      setIsEditCategoryOpen(false);
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Došlo je do greške pri ažuriranju kategorije.' 
          : 'There was an error updating the category.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategoryId) return;
    
    try {
      // Find the category to check if it has products
      const categoryToDelete = categories.find(cat => cat.id === deletingCategoryId);
      if (!categoryToDelete) return;
      
      if (categoryToDelete.productCount && categoryToDelete.productCount > 0) {
        toast({
          title: language === 'sr' ? 'Nije moguće obrisati' : 'Cannot delete',
          description: language === 'sr' 
            ? `Kategorija sadrži ${categoryToDelete.productCount} proizvoda. Premestite ili obrišite proizvode pre brisanja kategorije.` 
            : `Category contains ${categoryToDelete.productCount} products. Move or delete products before deleting the category.`,
          variant: 'destructive'
        });
        setIsDeleteConfirmOpen(false);
        setDeletingCategoryId(null);
        return;
      }
      
      // Delete category
      await api.deleteCategory(deletingCategoryId);
      
      // Update UI
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategoryId));
      setFilteredCategories(prev => prev.filter(cat => cat.id !== deletingCategoryId));
      
      toast({
        title: language === 'sr' ? 'Kategorija obrisana' : 'Category deleted',
        description: language === 'sr' 
          ? 'Kategorija je uspešno obrisana.' 
          : 'Category has been successfully deleted.',
      });
      
      // Reset and close dialog
      setDeletingCategoryId(null);
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Došlo je do greške pri brisanju kategorije.' 
          : 'There was an error deleting the category.',
        variant: 'destructive'
      });
    }
  };

  const handleOrderChange = async (categoryId: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) return;
    
    // Can't move up if already at the top
    if (direction === 'up' && categoryIndex === 0) return;
    
    // Can't move down if already at the bottom
    if (direction === 'down' && categoryIndex === categories.length - 1) return;
    
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    
    // Swap display orders
    const tempOrder = newCategories[categoryIndex].display_order;
    newCategories[categoryIndex].display_order = newCategories[targetIndex].display_order;
    newCategories[targetIndex].display_order = tempOrder;
    
    // Update in the database
    try {
      await api.updateCategory(newCategories[categoryIndex].id, {
        displayOrder: newCategories[categoryIndex].display_order
      });
      
      await api.updateCategory(newCategories[targetIndex].id, {
        displayOrder: newCategories[targetIndex].display_order
      });
      
      // Update local state to reflect the new order
      newCategories.sort((a, b) => a.display_order - b.display_order);
      setCategories(newCategories);
      setFilteredCategories(
        searchTerm ? newCategories.filter(cat => 
          cat.name_sr.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
        ) : newCategories
      );
    } catch (error) {
      console.error('Error updating category order:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' 
          ? 'Došlo je do greške pri promeni redosleda.' 
          : 'There was an error changing the order.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {dbStatus === 'disconnected' ? (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              {language === 'sr' ? 'Baza podataka nije povezana' : 'Database not connected'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {language === 'sr' 
                ? 'Potrebno je inicijalizovati bazu podataka kako biste mogli upravljati kategorijama.' 
                : 'You need to initialize the database in order to manage categories.'}
            </p>
            <Button 
              onClick={initializeDb} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {language === 'sr' ? 'Inicijalizuj bazu podataka' : 'Initialize Database'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold">
              {language === 'sr' ? 'Kategorije' : 'Categories'}
            </h1>
            
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  {language === 'sr' ? 'Dodaj kategoriju' : 'Add Category'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'sr' ? 'Dodaj novu kategoriju' : 'Add New Category'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'sr' 
                      ? 'Kreirajte novu kategoriju proizvoda. Kategorije pomažu u organizaciji vaših proizvoda.' 
                      : 'Create a new product category. Categories help organize your products.'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name_sr">
                      {language === 'sr' ? 'Naziv (srpski)' : 'Name (Serbian)'}
                    </Label>
                    <Input
                      id="name_sr"
                      value={newCategory.name_sr}
                      onChange={(e) => handleCategoryChange('name_sr', e.target.value)}
                      placeholder={language === 'sr' ? 'npr. Maske za telefone' : 'e.g. Phone Cases'}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="name_en">
                      {language === 'sr' ? 'Naziv (engleski)' : 'Name (English)'}
                    </Label>
                    <Input
                      id="name_en"
                      value={newCategory.name_en}
                      onChange={(e) => handleCategoryChange('name_en', e.target.value)}
                      placeholder={language === 'sr' ? 'npr. Phone Cases' : 'e.g. Phone Cases'}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={newCategory.slug}
                      onChange={(e) => handleCategoryChange('slug', e.target.value)}
                      placeholder={language === 'sr' ? 'npr. maske-za-telefone' : 'e.g. phone-cases'}
                    />
                    <p className="text-xs text-muted-foreground">
                      {language === 'sr' 
                        ? 'Koristi se u URL-ovima. Automatski se generiše iz naziva.' 
                        : 'Used in URLs. Generated automatically from the name.'}
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description_sr">
                      {language === 'sr' ? 'Opis (srpski)' : 'Description (Serbian)'}
                    </Label>
                    <Textarea
                      id="description_sr"
                      value={newCategory.description_sr}
                      onChange={(e) => handleCategoryChange('description_sr', e.target.value)}
                      placeholder={language === 'sr' ? 'Kratak opis ove kategorije' : 'Brief description of this category'}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description_en">
                      {language === 'sr' ? 'Opis (engleski)' : 'Description (English)'}
                    </Label>
                    <Textarea
                      id="description_en"
                      value={newCategory.description_en}
                      onChange={(e) => handleCategoryChange('description_en', e.target.value)}
                      placeholder={language === 'sr' ? 'Kratak opis ove kategorije' : 'Brief description of this category'}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="image">
                      {language === 'sr' ? 'Slika kategorije' : 'Category Image'}
                    </Label>
                    <Input
                      id="image"
                      value={newCategory.image}
                      onChange={(e) => handleCategoryChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="display_order">
                      {language === 'sr' ? 'Redosled prikaza' : 'Display Order'}
                    </Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={newCategory.display_order.toString()}
                      onChange={(e) => handleCategoryChange('display_order', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={newCategory.is_active}
                      onCheckedChange={(checked) => 
                        handleCategoryChange('is_active', Boolean(checked))
                      }
                    />
                    <Label htmlFor="is_active">
                      {language === 'sr' ? 'Aktivna (vidljiva na sajtu)' : 'Active (visible on the store)'}
                    </Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                    {language === 'sr' ? 'Otkaži' : 'Cancel'}
                  </Button>
                  <Button onClick={handleAddCategory}>
                    {language === 'sr' ? 'Sačuvaj kategoriju' : 'Save Category'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Edit Category Dialog */}
            <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'sr' ? 'Izmeni kategoriju' : 'Edit Category'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'sr' 
                      ? 'Izmenite postojeću kategoriju proizvoda.' 
                      : 'Modify the existing product category.'}
                  </DialogDescription>
                </DialogHeader>
                
                {editingCategory && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit_name_sr">
                        {language === 'sr' ? 'Naziv (srpski)' : 'Name (Serbian)'}
                      </Label>
                      <Input
                        id="edit_name_sr"
                        value={editingCategory.name_sr}
                        onChange={(e) => handleEditCategoryChange('name_sr', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit_name_en">
                        {language === 'sr' ? 'Naziv (engleski)' : 'Name (English)'}
                      </Label>
                      <Input
                        id="edit_name_en"
                        value={editingCategory.name_en}
                        onChange={(e) => handleEditCategoryChange('name_en', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit_slug">Slug</Label>
                      <Input
                        id="edit_slug"
                        value={editingCategory.slug}
                        onChange={(e) => handleEditCategoryChange('slug', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        {language === 'sr' 
                          ? 'Koristi se u URL-ovima. Automatski se generiše iz naziva.' 
                          : 'Used in URLs. Generated automatically from the name.'}
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit_description_sr">
                        {language === 'sr' ? 'Opis (srpski)' : 'Description (Serbian)'}
                      </Label>
                      <Textarea
                        id="edit_description_sr"
                        value={editingCategory.description_sr || ''}
                        onChange={(e) => handleEditCategoryChange('description_sr', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit_description_en">
                        {language === 'sr' ? 'Opis (engleski)' : 'Description (English)'}
                      </Label>
                      <Textarea
                        id="edit_description_en"
                        value={editingCategory.description_en || ''}
                        onChange={(e) => handleEditCategoryChange('description_en', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit_image">
                        {language === 'sr' ? 'Slika kategorije' : 'Category Image'}
                      </Label>
                      <Input
                        id="edit_image"
                        value={editingCategory.image || ''}
                        onChange={(e) => handleEditCategoryChange('image', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit_display_order">
                        {language === 'sr' ? 'Redosled prikaza' : 'Display Order'}
                      </Label>
                      <Input
                        id="edit_display_order"
                        type="number"
                        value={editingCategory.display_order.toString()}
                        onChange={(e) => handleEditCategoryChange('display_order', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit_is_active"
                        checked={editingCategory.is_active}
                        onCheckedChange={(checked) => 
                          handleEditCategoryChange('is_active', Boolean(checked))
                        }
                      />
                      <Label htmlFor="edit_is_active">
                        {language === 'sr' ? 'Aktivna (vidljiva na sajtu)' : 'Active (visible on the store)'}
                      </Label>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
                    {language === 'sr' ? 'Otkaži' : 'Cancel'}
                  </Button>
                  <Button onClick={handleUpdateCategory}>
                    {language === 'sr' ? 'Sačuvaj izmene' : 'Save Changes'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>
                    {language === 'sr' ? 'Potvrdi brisanje' : 'Confirm Deletion'}
                  </DialogTitle>
                  <DialogDescription>
                    {language === 'sr' 
                      ? 'Da li ste sigurni da želite da obrišete ovu kategoriju?' 
                      : 'Are you sure you want to delete this category?'}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                    {language === 'sr' ? 'Otkaži' : 'Cancel'}
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteCategory}>
                    {language === 'sr' ? 'Obriši' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>
                  {language === 'sr' ? 'Upravljanje kategorijama' : 'Manage Categories'}
                </CardTitle>
                <div className="w-full sm:w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder={language === 'sr' ? 'Pretraži kategorije...' : 'Search categories...'}
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? (language === 'sr' ? 'Nema rezultata za vašu pretragu.' : 'No results for your search.') 
                      : (language === 'sr' ? 'Nema kategorija. Dodajte prvu kategoriju.' : 'No categories. Add your first category.')}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => setIsAddCategoryOpen(true)}
                      size="sm"
                      className="flex items-center"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {language === 'sr' ? 'Dodaj kategoriju' : 'Add Category'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          {language === 'sr' ? 'Redosled' : 'Order'}
                        </TableHead>
                        <TableHead className="w-14"></TableHead>
                        <TableHead>
                          {language === 'sr' ? 'Naziv' : 'Name'}
                        </TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>
                          {language === 'sr' ? 'Proizvodi' : 'Products'}
                        </TableHead>
                        <TableHead>
                          {language === 'sr' ? 'Status' : 'Status'}
                        </TableHead>
                        <TableHead className="w-28">
                          {language === 'sr' ? 'Akcije' : 'Actions'}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleOrderChange(category.id, 'up')}
                              >
                                <MoveUp className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleOrderChange(category.id, 'down')}
                              >
                                <MoveDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden">
                              {category.image ? (
                                <img 
                                  src={category.image} 
                                  alt={category.name_sr} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-secondary text-muted-foreground">
                                  <ImagePlus className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {language === 'sr' ? category.name_sr : category.name_en}
                            <div className="text-xs text-muted-foreground">
                              {language === 'sr' ? category.description_sr : category.description_en}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {category.slug}
                          </TableCell>
                          <TableCell>
                            {category.productCount || 0}
                          </TableCell>
                          <TableCell>
                            <Badge variant={category.is_active ? 'default' : 'secondary'}>
                              {category.is_active 
                                ? (language === 'sr' ? 'Aktivna' : 'Active')
                                : (language === 'sr' ? 'Skrivena' : 'Hidden')
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setIsEditCategoryOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">
                                  {language === 'sr' ? 'Izmeni' : 'Edit'}
                                </span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  setDeletingCategoryId(category.id);
                                  setIsDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">
                                  {language === 'sr' ? 'Obriši' : 'Delete'}
                                </span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Categories;
