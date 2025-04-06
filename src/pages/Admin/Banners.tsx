
import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown,
  ImagePlus,
  Save,
  ArrowLeft,
  Link,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Switch } from '@/components/ui/switch';

// Mock banners data
const mockBanners = [
  {
    id: 'b1',
    title: 'Spring Sale',
    description: 'Save up to 50% on selected items',
    image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=300&auto=format&fit=crop',
    targetUrl: '/promotions/spring-sale',
    isActive: true,
    position: 'hero',
    order: 1,
  },
  {
    id: 'b2',
    title: 'New Arrivals',
    description: 'Check out our latest products',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=300&auto=format&fit=crop',
    targetUrl: '/new-arrivals',
    isActive: true,
    position: 'hero',
    order: 2,
  },
  {
    id: 'b3',
    title: 'Free Shipping',
    description: 'On all orders over 5000 RSD',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=300&auto=format&fit=crop',
    targetUrl: '/shipping-info',
    isActive: true,
    position: 'promo',
    order: 1,
  },
];

// Mock promotions data
const mockPromotions = [
  {
    id: 'p1',
    title: 'iPhone Accessories',
    description: 'Premium cases, chargers, and more',
    image: 'https://images.unsplash.com/photo-1605464375649-e3a730196d39?q=80&w=300&auto=format&fit=crop',
    targetUrl: '/categories/iphone-accessories',
    isActive: true,
    position: 'home',
    order: 1,
  },
  {
    id: 'p2',
    title: 'Samsung Collection',
    description: 'Exclusive accessories for Galaxy devices',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=300&auto=format&fit=crop',
    targetUrl: '/categories/samsung-accessories',
    isActive: true,
    position: 'home',
    order: 2,
  },
];

const Banners: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('banners');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    // In a real app, this would save the changes to a database
    console.log('Saving changes for:', currentItem);
    setIsEditModalOpen(false);
    setCurrentItem(null);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would delete the item from a database
    console.log('Deleting item with ID:', id);
  };

  const handleMoveUp = (id: string) => {
    // In a real app, this would update the order in a database
    console.log('Moving item up:', id);
  };

  const handleMoveDown = (id: string) => {
    // In a real app, this would update the order in a database
    console.log('Moving item down:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Banners & Promotions</h1>
        
        <Button size="sm" className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Hero Banners</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead className="w-32">Image</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBanners.filter(b => b.position === 'hero').map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveUp(banner.id)}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveDown(banner.id)}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-20 w-32 rounded-md bg-secondary overflow-hidden">
                          <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium">{banner.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {banner.description}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Link className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{banner.targetUrl}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                          {banner.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Promo Banners</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead className="w-32">Image</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBanners.filter(b => b.position === 'promo').map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveUp(banner.id)}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveDown(banner.id)}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-20 w-32 rounded-md bg-secondary overflow-hidden">
                          <img 
                            src={banner.image} 
                            alt={banner.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium">{banner.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {banner.description}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Link className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{banner.targetUrl}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                          {banner.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Home Page Promotions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Order</TableHead>
                    <TableHead className="w-32">Image</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-28">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPromotions.filter(p => p.position === 'home').map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveUp(promotion.id)}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => handleMoveDown(promotion.id)}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="h-20 w-32 rounded-md bg-secondary overflow-hidden">
                          <img 
                            src={promotion.image} 
                            alt={promotion.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="font-medium">{promotion.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {promotion.description}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Link className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{promotion.targetUrl}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={promotion.isActive ? 'default' : 'secondary'}>
                          {promotion.isActive ? 'Active' : 'Hidden'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(promotion)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(promotion.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit {activeTab === 'banners' ? 'Banner' : 'Promotion'}</DialogTitle>
            <DialogDescription>
              Make changes to the {activeTab === 'banners' ? 'banner' : 'promotion'} details below.
            </DialogDescription>
          </DialogHeader>
          
          {currentItem && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={currentItem.title} 
                      onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={currentItem.description}
                      onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="targetUrl">Target URL</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="targetUrl" 
                        value={currentItem.targetUrl}
                        onChange={(e) => setCurrentItem({...currentItem, targetUrl: e.target.value})}
                      />
                      <Button size="icon" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <select 
                      id="position"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={currentItem.position}
                      onChange={(e) => setCurrentItem({...currentItem, position: e.target.value})}
                    >
                      <option value="hero">Hero Slider</option>
                      <option value="promo">Promo Banner</option>
                      <option value="home">Home Page</option>
                      <option value="category">Category Page</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={currentItem.isActive}
                      onCheckedChange={(checked) => setCurrentItem({...currentItem, isActive: checked})}
                    />
                    <Label htmlFor="isActive">Active (visible on the site)</Label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Banner Image</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                    {currentItem.image ? (
                      <div className="relative group">
                        <img 
                          src={currentItem.image} 
                          alt={currentItem.title} 
                          className="mx-auto max-h-[200px] object-contain rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                          <Button variant="secondary" size="sm" className="mr-2">
                            <ImagePlus className="h-4 w-4 mr-1" />
                            Change
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground" />
                        <Button variant="secondary">
                          Upload Image
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium">Recommended image specifications:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Hero banner: 1920 x 600 pixels</li>
                      <li>Promo banner: 1200 x 300 pixels</li>
                      <li>Category promotion: 600 x 600 pixels</li>
                      <li>Format: JPG, PNG or WebP</li>
                      <li>Max file size: 2MB</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Banners;
