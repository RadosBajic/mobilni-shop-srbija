import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoveUp, 
  MoveDown,
  ImagePlus,
  Save,
  ArrowLeft,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
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
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SupabaseBannerService } from '@/services/SupabaseBannerService';
import { BannerType, PromotionType } from '@/types/banners';

const Banners: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('banners');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedBanners = await SupabaseBannerService.getBanners();
      const fetchedPromotions = await SupabaseBannerService.getPromotions();
      
      setBanners(fetchedBanners);
      setPromotions(fetchedPromotions);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: BannerType | PromotionType) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentItem) return;
    
    try {
      if (currentItem.id.startsWith('b')) {
        // It's a banner
        await SupabaseBannerService.updateBanner(currentItem.id, currentItem);
        setBanners(prev => prev.map(b => b.id === currentItem.id ? currentItem : b));
      } else {
        // It's a promotion
        await SupabaseBannerService.updatePromotion(currentItem.id, currentItem);
        setPromotions(prev => prev.map(p => p.id === currentItem.id ? currentItem : p));
      }
      
      toast({
        title: 'Success',
        description: 'Changes saved successfully.',
      });
      
      setIsEditModalOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (id.startsWith('b')) {
        // It's a banner
        await SupabaseBannerService.deleteBanner(id);
        setBanners(prev => prev.filter(b => b.id !== id));
      } else {
        // It's a promotion
        await SupabaseBannerService.deletePromotion(id);
        setPromotions(prev => prev.filter(p => p.id !== id));
      }
      
      toast({
        title: 'Success',
        description: 'Item deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMoveUp = async (id: string) => {
    try {
      if (id.startsWith('b')) {
        // It's a banner
        const index = banners.findIndex(b => b.id === id);
        if (index <= 0) return;
        
        const currentBanner = banners[index];
        const prevBanner = banners[index - 1];
        
        // Swap orders
        const newOrder = prevBanner.order;
        const prevOrder = currentBanner.order;
        
        await SupabaseBannerService.updateBanner(currentBanner.id, { ...currentBanner, order: newOrder });
        await SupabaseBannerService.updateBanner(prevBanner.id, { ...prevBanner, order: prevOrder });
        
        // Update local state
        const updatedBanners = [...banners];
        updatedBanners[index] = { ...currentBanner, order: newOrder };
        updatedBanners[index - 1] = { ...prevBanner, order: prevOrder };
        setBanners(updatedBanners.sort((a, b) => a.order - b.order));
      } else {
        // It's a promotion
        const index = promotions.findIndex(p => p.id === id);
        if (index <= 0) return;
        
        const currentPromo = promotions[index];
        const prevPromo = promotions[index - 1];
        
        // Swap orders
        const newOrder = prevPromo.order;
        const prevOrder = currentPromo.order;
        
        await SupabaseBannerService.updatePromotion(currentPromo.id, { ...currentPromo, order: newOrder });
        await SupabaseBannerService.updatePromotion(prevPromo.id, { ...prevPromo, order: prevOrder });
        
        // Update local state
        const updatedPromotions = [...promotions];
        updatedPromotions[index] = { ...currentPromo, order: newOrder };
        updatedPromotions[index - 1] = { ...prevPromo, order: prevOrder };
        setPromotions(updatedPromotions.sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error moving item up:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder items. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMoveDown = async (id: string) => {
    try {
      if (id.startsWith('b')) {
        // It's a banner
        const index = banners.findIndex(b => b.id === id);
        if (index >= banners.length - 1) return;
        
        const currentBanner = banners[index];
        const nextBanner = banners[index + 1];
        
        // Swap orders
        const newOrder = nextBanner.order;
        const nextOrder = currentBanner.order;
        
        await SupabaseBannerService.updateBanner(currentBanner.id, { ...currentBanner, order: newOrder });
        await SupabaseBannerService.updateBanner(nextBanner.id, { ...nextBanner, order: nextOrder });
        
        // Update local state
        const updatedBanners = [...banners];
        updatedBanners[index] = { ...currentBanner, order: newOrder };
        updatedBanners[index + 1] = { ...nextBanner, order: nextOrder };
        setBanners(updatedBanners.sort((a, b) => a.order - b.order));
      } else {
        // It's a promotion
        const index = promotions.findIndex(p => p.id === id);
        if (index >= promotions.length - 1) return;
        
        const currentPromo = promotions[index];
        const nextPromo = promotions[index + 1];
        
        // Swap orders
        const newOrder = nextPromo.order;
        const nextOrder = currentPromo.order;
        
        await SupabaseBannerService.updatePromotion(currentPromo.id, { ...currentPromo, order: newOrder });
        await SupabaseBannerService.updatePromotion(nextPromo.id, { ...nextPromo, order: nextOrder });
        
        // Update local state
        const updatedPromotions = [...promotions];
        updatedPromotions[index] = { ...currentPromo, order: newOrder };
        updatedPromotions[index + 1] = { ...nextPromo, order: nextOrder };
        setPromotions(updatedPromotions.sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error moving item down:', error);
      toast({
        title: 'Error',
        description: 'Failed to reorder items. Please try again.',
        variant: 'destructive',
      });
    }
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
        
        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
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
                      {banners.filter(b => b.position === 'hero').map((banner) => (
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
                                alt={banner.title.en} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="font-medium">{banner.title.en}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {banner.description.en}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
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
                      {banners.filter(b => b.position === 'promo').map((banner) => (
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
                                alt={banner.title.en} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="font-medium">{banner.title.en}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {banner.description.en}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
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
                      {promotions.filter(p => p.position === 'home').map((promotion) => (
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
                                alt={promotion.title.en} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="font-medium">{promotion.title.en}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">
                              {promotion.description.en}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <LinkIcon className="h-3 w-3 mr-1 flex-shrink-0" />
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
          </>
        )}
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
                    <Label htmlFor="title_en">Title (English)</Label>
                    <Input 
                      id="title_en" 
                      value={currentItem.title.en} 
                      onChange={(e) => setCurrentItem({
                        ...currentItem, 
                        title: { ...currentItem.title, en: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title_sr">Title (Serbian)</Label>
                    <Input 
                      id="title_sr" 
                      value={currentItem.title.sr} 
                      onChange={(e) => setCurrentItem({
                        ...currentItem, 
                        title: { ...currentItem.title, sr: e.target.value }
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description_en">Description (English)</Label>
                    <Textarea 
                      id="description_en" 
                      value={currentItem.description.en}
                      onChange={(e) => setCurrentItem({
                        ...currentItem, 
                        description: { ...currentItem.description, en: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description_sr">Description (Serbian)</Label>
                    <Textarea 
                      id="description_sr" 
                      value={currentItem.description.sr}
                      onChange={(e) => setCurrentItem({
                        ...currentItem, 
                        description: { ...currentItem.description, sr: e.target.value }
                      })}
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
                      {currentItem.id.startsWith('b') ? (
                        <>
                          <option value="hero">Hero Slider</option>
                          <option value="promo">Promo Banner</option>
                        </>
                      ) : (
                        <>
                          <option value="home">Home Page</option>
                          <option value="category">Category Page</option>
                        </>
                      )}
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
                          alt={currentItem.title.en} 
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
