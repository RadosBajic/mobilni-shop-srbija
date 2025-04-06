
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown,
  ImagePlus,
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

// Mock categories data
const mockCategories = [
  {
    id: 'c1',
    name: 'Maske za telefone',
    slug: 'maske-za-telefone',
    description: 'Sve vrste maski i zaštita za mobilne telefone',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=100&auto=format&fit=crop',
    productCount: 87,
    isActive: true,
    order: 1,
  },
  {
    id: 'c2',
    name: 'Zaštita ekrana',
    slug: 'zastita-ekrana',
    description: 'Zaštitna stakla i folije za sve modele telefona',
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=100&auto=format&fit=crop',
    productCount: 42,
    isActive: true,
    order: 2,
  },
  {
    id: 'c3',
    name: 'Slušalice',
    slug: 'slusalice',
    description: 'Bežične i žičane slušalice vrhunskog kvaliteta',
    image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=100&auto=format&fit=crop',
    productCount: 35,
    isActive: true,
    order: 3,
  },
  {
    id: 'c4',
    name: 'Punjači',
    slug: 'punjaci',
    description: 'Brzi punjači i adapteri za sve uređaje',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=100&auto=format&fit=crop',
    productCount: 29,
    isActive: true,
    order: 4,
  },
  {
    id: 'c5',
    name: 'Kablovi',
    slug: 'kablovi',
    description: 'USB, USB-C, Lightning i drugi kablovi',
    image: 'https://images.unsplash.com/photo-1605464375649-e3a730196d39?q=80&w=100&auto=format&fit=crop',
    productCount: 38,
    isActive: true,
    order: 5,
  },
  {
    id: 'c6',
    name: 'Smartwatch dodaci',
    slug: 'smartwatch-dodaci',
    description: 'Dodatna oprema za pametne satove',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=100&auto=format&fit=crop',
    productCount: 12,
    isActive: false,
    order: 6,
  },
];

const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true
  });
  
  const filteredCategories = mockCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic would be implemented here in a real app
    console.log('Searching for:', searchTerm);
  };
  
  const handleCategoryChange = (field: string, value: string | boolean) => {
    setNewCategory(prev => ({
      ...prev,
      [field]: value,
      // Auto-generate slug from name if the field is 'name'
      ...((field === 'name' && typeof value === 'string') ? {
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      } : {})
    }));
  };
  
  const handleAddCategory = () => {
    // In a real app, this would send data to an API
    console.log('Adding new category:', newCategory);
    // Reset form and close dialog
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      isActive: true
    });
    setIsAddCategoryOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        
        <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new product category. Categories help organize your products.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => handleCategoryChange('name', e.target.value)}
                  placeholder="e.g. Phone Cases"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newCategory.slug}
                  onChange={(e) => handleCategoryChange('slug', e.target.value)}
                  placeholder="e.g. phone-cases"
                />
                <p className="text-xs text-muted-foreground">
                  Used in URLs. Generated automatically from the name.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => handleCategoryChange('description', e.target.value)}
                  placeholder="Brief description of this category"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Category Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center">
                    <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <Button variant="outline" type="button">
                    Upload Image
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={newCategory.isActive}
                  onCheckedChange={(checked) => 
                    handleCategoryChange('isActive', Boolean(checked))
                  }
                />
                <Label htmlFor="isActive">Active (visible on the store)</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>
                Save Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Manage Categories</CardTitle>
            <form onSubmit={handleSearch} className="w-full sm:w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead className="w-14"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-28">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-secondary overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                      <div className="text-xs text-muted-foreground">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell>
                      {category.productCount}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Hidden'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
