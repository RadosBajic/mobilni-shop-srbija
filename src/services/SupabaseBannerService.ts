
import { supabase } from '@/integrations/supabase/client';
import { BannerType, PromotionType } from '@/types/banners';

export const SupabaseBannerService = {
  // Banner methods
  getBanners: async (position?: 'hero' | 'promo'): Promise<BannerType[]> => {
    let query = supabase.from('banners').select('*');
    
    if (position) {
      query = query.eq('position', position);
    }
    
    query = query.order('order', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
    
    return data.map(banner => ({
      id: banner.id,
      title: {
        sr: banner.title_sr,
        en: banner.title_en
      },
      description: {
        sr: banner.description_sr,
        en: banner.description_en
      },
      image: banner.image,
      targetUrl: banner.target_url,
      isActive: banner.is_active,
      position: banner.position as 'hero' | 'promo',
      order: banner.order,
      startDate: banner.start_date,
      endDate: banner.end_date
    }));
  },

  getBannerById: async (id: string): Promise<BannerType | null> => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching banner:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: {
        sr: data.title_sr,
        en: data.title_en
      },
      description: {
        sr: data.description_sr,
        en: data.description_en
      },
      image: data.image,
      targetUrl: data.target_url,
      isActive: data.is_active,
      position: data.position as 'hero' | 'promo',
      order: data.order,
      startDate: data.start_date,
      endDate: data.end_date
    };
  },

  createBanner: async (banner: Omit<BannerType, 'id'>): Promise<BannerType> => {
    const { data, error } = await supabase
      .from('banners')
      .insert({
        title_sr: banner.title.sr,
        title_en: banner.title.en,
        description_sr: banner.description.sr,
        description_en: banner.description.en,
        image: banner.image,
        target_url: banner.targetUrl,
        is_active: banner.isActive,
        position: banner.position,
        order: banner.order,
        start_date: banner.startDate,
        end_date: banner.endDate
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: {
        sr: data.title_sr,
        en: data.title_en
      },
      description: {
        sr: data.description_sr,
        en: data.description_en
      },
      image: data.image,
      targetUrl: data.target_url,
      isActive: data.is_active,
      position: data.position as 'hero' | 'promo',
      order: data.order,
      startDate: data.start_date,
      endDate: data.end_date
    };
  },

  updateBanner: async (id: string, updates: Partial<BannerType>): Promise<BannerType> => {
    const updateData: any = {};
    
    if (updates.title) {
      updateData.title_sr = updates.title.sr;
      updateData.title_en = updates.title.en;
    }
    if (updates.description) {
      updateData.description_sr = updates.description.sr;
      updateData.description_en = updates.description.en;
    }
    if (updates.image) updateData.image = updates.image;
    if (updates.targetUrl) updateData.target_url = updates.targetUrl;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.position) updateData.position = updates.position;
    if (updates.order !== undefined) updateData.order = updates.order;
    if (updates.startDate) updateData.start_date = updates.startDate;
    if (updates.endDate) updateData.end_date = updates.endDate;

    const { data, error } = await supabase
      .from('banners')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: {
        sr: data.title_sr,
        en: data.title_en
      },
      description: {
        sr: data.description_sr,
        en: data.description_en
      },
      image: data.image,
      targetUrl: data.target_url,
      isActive: data.is_active,
      position: data.position as 'hero' | 'promo',
      order: data.order,
      startDate: data.start_date,
      endDate: data.end_date
    };
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
    
    return true;
  },

  // Promotion methods
  getPromotions: async (position?: 'home' | 'category'): Promise<PromotionType[]> => {
    let query = supabase.from('promotions').select('*');
    
    if (position) {
      query = query.eq('position', position);
    }
    
    query = query.order('order', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
    
    return data.map(promo => ({
      id: promo.id,
      title: {
        sr: promo.title_sr,
        en: promo.title_en
      },
      description: {
        sr: promo.description_sr,
        en: promo.description_en
      },
      image: promo.image,
      targetUrl: promo.target_url,
      isActive: promo.is_active,
      position: promo.position as 'home' | 'category',
      order: promo.order,
      discount: promo.discount,
      startDate: promo.start_date,
      endDate: promo.end_date
    }));
  },

  getPromotionById: async (id: string): Promise<PromotionType | null> => {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching promotion:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: {
        sr: data.title_sr,
        en: data.title_en
      },
      description: {
        sr: data.description_sr,
        en: data.description_en
      },
      image: data.image,
      targetUrl: data.target_url,
      isActive: data.is_active,
      position: data.position as 'home' | 'category',
      order: data.order,
      discount: data.discount,
      startDate: data.start_date,
      endDate: data.end_date
    };
  },

  createPromotion: async (promotion: Omit<PromotionType, 'id'>): Promise<PromotionType> => {
    const { data, error } = await supabase
      .from('promotions')
      .insert({
        title_sr: promotion.title.sr,
        title_en: promotion.title.en,
        description_sr: promotion.description.sr,
        description_en: promotion.description.en,
        image: promotion.image,
        target_url: promotion.targetUrl,
        is_active: promotion.isActive,
        position: promotion.position,
        order: promotion.order,
        discount: promotion.discount,
        start_date: promotion.startDate,
        end_date: promotion.endDate
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: {
        sr: data.title_sr,
        en: data.title_en
      },
      description: {
        sr: data.description_sr,
        en: data.description_en
      },
      image: data.image,
      targetUrl: data.target_url,
      isActive: data.is_active,
      position: data.position as 'home' | 'category',
      order: data.order,
      discount: data.discount,
      startDate: data.start_date,
      endDate: data.end_date
    };
  },

  updatePromotion: async (id: string, updates: Partial<PromotionType>): Promise<PromotionType> => {
    const updateData: any = {};
    
    if (updates.title) {
      updateData.title_sr = updates.title.sr;
      updateData.title_en = updates.title.en;
    }
    if (updates.description) {
      updateData.description_sr = updates.description.sr;
      updateData.description_en = updates.description.en;
    }
    if (updates.image) updateData.image = updates.image;
    if (updates.targetUrl) updateData.target_url = updates.targetUrl;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.position) updateData.position = updates.position;
    if (updates.order !== undefined) updateData.order = updates.order;
    if (updates.discount !== undefined) updateData.discount = updates.discount;
    if (updates.startDate) updateData.start_date = updates.startDate;
    if (updates.endDate) updateData.end_date = updates.endDate;

    const { data, error } = await supabase
      .from('promotions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: {
        sr: data.title_sr,
        en: data.title_en
      },
      description: {
        sr: data.description_sr,
        en: data.description_en
      },
      image: data.image,
      targetUrl: data.target_url,
      isActive: data.is_active,
      position: data.position as 'home' | 'category',
      order: data.order,
      discount: data.discount,
      startDate: data.start_date,
      endDate: data.end_date
    };
  },

  deletePromotion: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
    
    return true;
  }
};
