
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { SupabaseBannerService, Banner } from '@/services/SupabaseBannerService';
import { Trash, Pencil, Plus, ImageIcon, Calendar, Link, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';

// Define banner type from the imported type
type BannerType = Banner;

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [promotions, setPromotions] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('banners');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<BannerType | null>(null);
  const { toast } = useToast();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const data = await SupabaseBannerService.getBanners('home');
      setBanners(data);
      
      const promoData = await SupabaseBannerService.getPromotions();
      setPromotions(promoData);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: 'Error',
        description: 'There was an error loading banners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreateBanner = () => {
    setCurrentBanner(null);
    setIsDialogOpen(true);
  };

  const handleEditBanner = (banner: BannerType) => {
    setCurrentBanner(banner);
    setIsDialogOpen(true);
  };

  const handleSaveBanner = async (data: any) => {
    try {
      if (currentBanner) {
        if (activeTab === 'banners') {
          await SupabaseBannerService.updateBanner(currentBanner.id, {
            title_sr: data.title_sr,
            title_en: data.title_en,
            description_sr: data.description_sr,
            description_en: data.description_en,
            image: data.image,
            target_url: data.target_url,
            is_active: data.is_active,
            start_date: data.start_date,
            end_date: data.end_date,
          });
          toast({
            title: 'Success',
            description: 'Banner updated successfully',
          });
        } else {
          await SupabaseBannerService.updatePromotion(currentBanner.id, {
            title_sr: data.title_sr,
            title_en: data.title_en,
            description_sr: data.description_sr,
            description_en: data.description_en,
            image: data.image,
            target_url: data.target_url,
            is_active: data.is_active,
            discount: data.discount,
            start_date: data.start_date,
            end_date: data.end_date,
          });
          toast({
            title: 'Success',
            description: 'Promotion updated successfully',
          });
        }
      } else {
        if (activeTab === 'banners') {
          await SupabaseBannerService.createBanner({
            title_sr: data.title_sr,
            title_en: data.title_en,
            description_sr: data.description_sr,
            description_en: data.description_en,
            image: data.image,
            target_url: data.target_url,
            is_active: data.is_active,
            position: 'home',
            order: banners.length,
            start_date: data.start_date,
            end_date: data.end_date,
          });
          toast({
            title: 'Success',
            description: 'Banner created successfully',
          });
        } else {
          await SupabaseBannerService.createPromotion({
            title_sr: data.title_sr,
            title_en: data.title_en,
            description_sr: data.description_sr,
            description_en: data.description_en,
            image: data.image,
            target_url: data.target_url,
            is_active: data.is_active,
            position: 'promotion',
            order: promotions.length,
            discount: data.discount,
            start_date: data.start_date,
            end_date: data.end_date,
          });
          toast({
            title: 'Success',
            description: 'Promotion created successfully',
          });
        }
      }
      setIsDialogOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving the banner',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (banner: BannerType) => {
    setCurrentBanner(banner);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentBanner) return;
    
    try {
      if (activeTab === 'banners') {
        await SupabaseBannerService.deleteBanner(currentBanner.id);
        toast({
          title: 'Success',
          description: 'Banner deleted successfully',
        });
      } else {
        await SupabaseBannerService.deletePromotion(currentBanner.id);
        toast({
          title: 'Success',
          description: 'Promotion deleted successfully',
        });
      }
      setIsDeleteDialogOpen(false);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting the banner',
        variant: 'destructive',
      });
    }
  };

  const BannerForm = () => {
    const form = useForm({
      defaultValues: {
        title_sr: currentBanner?.title_sr || '',
        title_en: currentBanner?.title_en || '',
        description_sr: currentBanner?.description_sr || '',
        description_en: currentBanner?.description_en || '',
        image: currentBanner?.image || '',
        target_url: currentBanner?.target_url || '',
        is_active: currentBanner?.is_active ?? true,
        discount: (currentBanner as any)?.discount || '',
        start_date: currentBanner?.start_date || '',
        end_date: currentBanner?.end_date || '',
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveBanner)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title_sr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Serbian)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (English)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="description_sr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Serbian)</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (English)</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} value={field.value || ''} />
                      <Button type="button" variant="outline" size="icon">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter image URL or upload an image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input {...field} value={field.value || ''} />
                      <Link className="h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Where users will be directed when clicking the banner
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {activeTab === 'promotions' && (
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input {...field} type="date" value={field.value || ''} />
                      <Calendar className="h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input {...field} type="date" value={field.value || ''} />
                      <Calendar className="h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0">
                <FormControl>
                  <Switch 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                </FormControl>
                <div>
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Only active banners are shown on the site
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Marketing</h1>
        <Button onClick={handleCreateBanner} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {activeTab === 'banners' ? 'Add Banner' : 'Add Promotion'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Target URL</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : banners.length > 0 ? (
                banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-16 h-10 bg-muted rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {banner.image ? (
                          <img
                            src={banner.image}
                            alt={banner.title_sr}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title_sr}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {banner.target_url ? (
                        <div className="flex items-center gap-1">
                          <Link className="w-3 h-3" />
                          <span className="text-sm truncate max-w-[180px]">
                            {banner.target_url}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${banner.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>{banner.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditBanner(banner)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(banner)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No banners found. Click "Add Banner" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="promotions">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Discount</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : promotions.length > 0 ? (
                promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div className="w-16 h-10 bg-muted rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {promotion.image ? (
                          <img
                            src={promotion.image}
                            alt={promotion.title_sr}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{promotion.title_sr}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(promotion as any).discount ? (
                        <span className="font-bold text-green-600">
                          {(promotion as any).discount}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${promotion.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>{promotion.is_active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditBanner(promotion)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(promotion)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    No promotions found. Click "Add Promotion" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Banner Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentBanner ? 'Edit' : 'Create'} {activeTab === 'banners' ? 'Banner' : 'Promotion'}
            </DialogTitle>
            <DialogDescription>
              {currentBanner
                ? `Edit the details of your ${activeTab === 'banners' ? 'banner' : 'promotion'}`
                : `Add a new ${activeTab === 'banners' ? 'banner' : 'promotion'} to your website`}
            </DialogDescription>
          </DialogHeader>
          <BannerForm />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {activeTab === 'banners' ? 'banner' : 'promotion'}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
