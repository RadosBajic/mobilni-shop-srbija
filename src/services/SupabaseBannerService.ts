
import { supabase } from '@/integrations/supabase/client';

export interface Banner {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  description?: {
    sr?: string;
    en?: string;
  };
  image: string;
  link?: string;
  position: string; // 'hero', 'promo', etc.
  order: number;
  is_active: boolean;
}

export const SupabaseBannerService = {
  getBanners: async (position: string): Promise<Banner[]> => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('position', position)
        .order('order', { ascending: true });
        
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          sr: item.title_sr || item.title || '',
          en: item.title_en || item.title || '',
        },
        description: item.description ? {
          sr: item.description_sr || item.description || '',
          en: item.description_en || item.description || '',
        } : undefined,
        image: item.image,
        link: item.link,
        position: item.position,
        order: item.order,
        is_active: item.is_active,
      }));
    } catch (error) {
      console.error(`Error fetching ${position} banners:`, error);
      
      // Return mock banners
      return getMockBanners(position);
    }
  },
  
  createBanner: async (banner: Partial<Banner>): Promise<Banner> => {
    try {
      const bannerData = {
        title: banner.title?.en || '',
        title_sr: banner.title?.sr || '',
        title_en: banner.title?.en || '',
        description: banner.description?.en || null,
        description_sr: banner.description?.sr || null,
        description_en: banner.description?.en || null,
        image: banner.image || '',
        link: banner.link || null,
        position: banner.position || 'hero',
        order: banner.order || 0,
        is_active: banner.is_active !== undefined ? banner.is_active : true,
      };
      
      const { data, error } = await supabase
        .from('banners')
        .insert(bannerData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }

      return {
        id: data.id,
        title: {
          sr: data.title_sr || data.title || '',
          en: data.title_en || data.title || '',
        },
        description: data.description ? {
          sr: data.description_sr || data.description || '',
          en: data.description_en || data.description || '',
        } : undefined,
        image: data.image,
        link: data.link,
        position: data.position,
        order: data.order,
        is_active: data.is_active,
      };
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },
  
  updateBanner: async (id: string, banner: Partial<Banner>): Promise<Banner> => {
    try {
      const bannerData: any = {};
      
      if (banner.title) {
        bannerData.title = banner.title.en || '';
        bannerData.title_sr = banner.title.sr || '';
        bannerData.title_en = banner.title.en || '';
      }
      
      if (banner.description) {
        bannerData.description = banner.description.en || null;
        bannerData.description_sr = banner.description.sr || null;
        bannerData.description_en = banner.description.en || null;
      }
      
      if (banner.image !== undefined) bannerData.image = banner.image;
      if (banner.link !== undefined) bannerData.link = banner.link;
      if (banner.position !== undefined) bannerData.position = banner.position;
      if (banner.order !== undefined) bannerData.order = banner.order;
      if (banner.is_active !== undefined) bannerData.is_active = banner.is_active;
      
      const { data, error } = await supabase
        .from('banners')
        .update(bannerData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }

      return {
        id: data.id,
        title: {
          sr: data.title_sr || data.title || '',
          en: data.title_en || data.title || '',
        },
        description: data.description ? {
          sr: data.description_sr || data.description || '',
          en: data.description_en || data.description || '',
        } : undefined,
        image: data.image,
        link: data.link,
        position: data.position,
        order: data.order,
        is_active: data.is_active,
      };
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },
  
  deleteBanner: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },
  
  reorderBanners: async (bannerIds: string[]): Promise<boolean> => {
    try {
      // Update each banner's order in a transaction
      const updates = bannerIds.map((id, index) => {
        return supabase
          .from('banners')
          .update({ order: index })
          .eq('id', id);
      });
      
      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Error reordering banners:', error);
      throw error;
    }
  }
};

// Helper functions for mock data
const getMockBanners = (position: string): Banner[] => {
  const mockHeroBanners: Banner[] = [
    {
      id: '1',
      title: {
        sr: 'Nova kolekcija zaštitnih maski',
        en: 'New Collection of Phone Cases',
      },
      description: {
        sr: 'Istražite našu novu kolekciju vrhunskih zaštitnih maski za najnovije modele telefona',
        en: 'Explore our new collection of premium phone cases for the latest models',
      },
      image: 'https://picsum.photos/seed/banner1/1200/400',
      link: '/kategorija/phone-cases',
      position: 'hero',
      order: 1,
      is_active: true,
    },
    {
      id: '2',
      title: {
        sr: 'Popust na punjače',
        en: 'Discount on Chargers',
      },
      description: {
        sr: 'Uštedite do 30% na sve punjače i kablove',
        en: 'Save up to 30% on all chargers and cables',
      },
      image: 'https://picsum.photos/seed/banner2/1200/400',
      link: '/kategorija/chargers',
      position: 'hero',
      order: 2,
      is_active: true,
    },
  ];
  
  const mockPromoBanners: Banner[] = [
    {
      id: '3',
      title: {
        sr: 'Besplatna dostava',
        en: 'Free Shipping',
      },
      description: {
        sr: 'Za sve porudžbine preko 3000 dinara',
        en: 'For all orders over 3000 RSD',
      },
      image: 'https://picsum.photos/seed/promo1/800/400',
      link: '/about',
      position: 'promo',
      order: 1,
      is_active: true,
    },
  ];
  
  if (position === 'hero') {
    return mockHeroBanners;
  } else if (position === 'promo') {
    return mockPromoBanners;
  } else {
    return [];
  }
};
