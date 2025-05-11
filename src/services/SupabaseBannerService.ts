
import { supabase } from '@/integrations/supabase/client';

export interface Banner {
  id: string;
  title_sr: string;
  title_en: string;
  description_sr: string | null;
  description_en: string | null;
  image: string | null;
  target_url: string | null;
  is_active: boolean;
  position: string;
  order: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Helper function to map to frontend banner object
export const mapToBanner = (data: any): Banner => ({
  id: data.id,
  title_sr: data.title_sr,
  title_en: data.title_en,
  description_sr: data.description_sr,
  description_en: data.description_en,
  image: data.image,
  target_url: data.target_url,
  is_active: data.is_active,
  position: data.position,
  order: data.order,
  start_date: data.start_date,
  end_date: data.end_date,
  created_at: data.created_at,
  updated_at: data.updated_at
});

export interface Promotion extends Banner {
  discount: number | null;
}

// Export the Supabase banner service
export const SupabaseBannerService = {
  getBanners: async (position: string): Promise<Banner[]> => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('position', position)
        .order('order');

      if (error) throw error;
      
      return data.map(mapToBanner);
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },
  
  getPromotions: async (limit?: number): Promise<Promotion[]> => {
    try {
      let query = supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('order');
        
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data.map((promo: any) => ({
        id: promo.id,
        title_sr: promo.title_sr,
        title_en: promo.title_en,
        description_sr: promo.description_sr,
        description_en: promo.description_en,
        image: promo.image,
        target_url: promo.target_url,
        is_active: promo.is_active,
        position: promo.position,
        order: promo.order,
        discount: promo.discount,
        start_date: promo.start_date,
        end_date: promo.end_date,
        created_at: promo.created_at,
        updated_at: promo.updated_at
      }));
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },

  createBanner: async (banner: Partial<Banner>): Promise<Banner> => {
    try {
      // Make sure required properties are present
      const bannerData = {
        title_sr: banner.title_sr || '',
        title_en: banner.title_en || '',
        description_sr: banner.description_sr || null,
        description_en: banner.description_en || null,
        image: banner.image || null,
        target_url: banner.target_url || null,
        is_active: banner.is_active !== undefined ? banner.is_active : true,
        position: banner.position || 'home',
        order: banner.order !== undefined ? banner.order : 0,
        start_date: banner.start_date || null,
        end_date: banner.end_date || null
      };

      const { data, error } = await supabase
        .from('banners')
        .insert(bannerData)
        .select()
        .single();

      if (error) throw error;
      
      return mapToBanner(data);
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },
  
  createPromotion: async (promotion: Partial<Promotion>): Promise<Promotion> => {
    try {
      // Make sure required properties are present
      const promotionData = {
        title_sr: promotion.title_sr || '',
        title_en: promotion.title_en || '',
        description_sr: promotion.description_sr || null,
        description_en: promotion.description_en || null,
        image: promotion.image || null,
        target_url: promotion.target_url || null,
        is_active: promotion.is_active !== undefined ? promotion.is_active : true,
        position: promotion.position || 'promotion',
        order: promotion.order !== undefined ? promotion.order : 0,
        discount: promotion.discount || null,
        start_date: promotion.start_date || null,
        end_date: promotion.end_date || null
      };

      const { data, error } = await supabase
        .from('promotions')
        .insert(promotionData)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...mapToBanner(data),
        discount: data.discount
      };
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  updateBanner: async (id: string, banner: Partial<Banner>): Promise<Banner> => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .update(banner)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return mapToBanner(data);
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },
  
  updatePromotion: async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .update(promotion)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        ...mapToBanner(data),
        discount: data.discount
      };
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting banner:', error);
      return false;
    }
  },
  
  deletePromotion: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      return false;
    }
  },

  reorderBanners: async (bannerIds: string[]): Promise<boolean> => {
    try {
      // Update each banner's order in sequence
      for (let i = 0; i < bannerIds.length; i++) {
        const { error } = await supabase
          .from('banners')
          .update({ order: i })
          .eq('id', bannerIds[i]);

        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering banners:', error);
      return false;
    }
  },
  
  reorderPromotions: async (promotionIds: string[]): Promise<boolean> => {
    try {
      // Update each promotion's order in sequence
      for (let i = 0; i < promotionIds.length; i++) {
        const { error } = await supabase
          .from('promotions')
          .update({ order: i })
          .eq('id', promotionIds[i]);

        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error reordering promotions:', error);
      return false;
    }
  }
};

export default SupabaseBannerService;
