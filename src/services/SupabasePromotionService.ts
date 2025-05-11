
import { supabase } from '@/integrations/supabase/client';

export interface Promotion {
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
  position: string;
  order: number;
  is_active: boolean;
  backgroundColor?: string;
  textColor?: string;
}

export const SupabasePromotionService = {
  getPromotions: async (position: string, limit?: number): Promise<Promotion[]> => {
    try {
      let query = supabase
        .from('promotions')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .order('order', { ascending: true });
        
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          sr: item.title_sr || '',
          en: item.title_en || '',
        },
        description: item.description_sr || item.description_en ? {
          sr: item.description_sr || '',
          en: item.description_en || '',
        } : undefined,
        image: item.image || '',
        link: item.target_url || undefined,
        position: item.position,
        order: item.order,
        is_active: item.is_active,
        backgroundColor: item.background_color || undefined,
        textColor: item.text_color || undefined,
      }));
    } catch (error) {
      console.error(`Error fetching ${position} promotions:`, error);
      
      // Return mock promotions
      return getMockPromotions(position, limit);
    }
  },
  
  createPromotion: async (promotion: Partial<Promotion>): Promise<Promotion> => {
    try {
      const promotionData = {
        title_sr: promotion.title?.sr || '',
        title_en: promotion.title?.en || '',
        description_sr: promotion.description?.sr || null,
        description_en: promotion.description?.en || null,
        image: promotion.image || '',
        target_url: promotion.link || null,
        position: promotion.position || 'home',
        order: promotion.order || 0,
        is_active: promotion.is_active !== undefined ? promotion.is_active : true,
        background_color: promotion.backgroundColor || null,
        text_color: promotion.textColor || null,
      };
      
      const { data, error } = await supabase
        .from('promotions')
        .insert(promotionData)
        .select()
        .single();
        
      if (error) {
        throw error;
      }

      return {
        id: data.id,
        title: {
          sr: data.title_sr || '',
          en: data.title_en || '',
        },
        description: data.description_sr || data.description_en ? {
          sr: data.description_sr || '',
          en: data.description_en || '',
        } : undefined,
        image: data.image || '',
        link: data.target_url || undefined,
        position: data.position,
        order: data.order,
        is_active: data.is_active,
        backgroundColor: data.background_color || undefined,
        textColor: data.text_color || undefined,
      };
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },
  
  updatePromotion: async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
    try {
      const promotionData: any = {};
      
      if (promotion.title) {
        promotionData.title_sr = promotion.title.sr || '';
        promotionData.title_en = promotion.title.en || '';
      }
      
      if (promotion.description) {
        promotionData.description_sr = promotion.description.sr || null;
        promotionData.description_en = promotion.description.en || null;
      }
      
      if (promotion.image !== undefined) promotionData.image = promotion.image;
      if (promotion.link !== undefined) promotionData.target_url = promotion.link;
      if (promotion.position !== undefined) promotionData.position = promotion.position;
      if (promotion.order !== undefined) promotionData.order = promotion.order;
      if (promotion.is_active !== undefined) promotionData.is_active = promotion.is_active;
      if (promotion.backgroundColor !== undefined) promotionData.background_color = promotion.backgroundColor;
      if (promotion.textColor !== undefined) promotionData.text_color = promotion.textColor;
      
      const { data, error } = await supabase
        .from('promotions')
        .update(promotionData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }

      return {
        id: data.id,
        title: {
          sr: data.title_sr || '',
          en: data.title_en || '',
        },
        description: data.description_sr || data.description_en ? {
          sr: data.description_sr || '',
          en: data.description_en || '',
        } : undefined,
        image: data.image || '',
        link: data.target_url || undefined,
        position: data.position,
        order: data.order,
        is_active: data.is_active,
        backgroundColor: data.background_color || undefined,
        textColor: data.text_color || undefined,
      };
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  },
  
  deletePromotion: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  }
};

// Helper functions for mock data
const getMockPromotions = (position: string, limit?: number): Promotion[] => {
  const mockHomePromotions: Promotion[] = [
    {
      id: '1',
      title: {
        sr: 'Prolećna rasprodaja',
        en: 'Spring Sale',
      },
      description: {
        sr: 'Uštedite do 40% na odabrane artikle',
        en: 'Save up to 40% on selected items',
      },
      image: 'https://picsum.photos/seed/promo1/600/300',
      link: '/proizvodi?sale=true',
      position: 'home',
      order: 1,
      is_active: true,
      backgroundColor: '#fef2f2',
      textColor: '#991b1b',
    },
    {
      id: '2',
      title: {
        sr: 'Nove maske za iPhone 15',
        en: 'New iPhone 15 Cases',
      },
      description: {
        sr: 'Istražite našu novu kolekciju',
        en: 'Explore our new collection',
      },
      image: 'https://picsum.photos/seed/promo2/600/300',
      link: '/kategorija/phone-cases',
      position: 'home',
      order: 2,
      is_active: true,
      backgroundColor: '#eff6ff',
      textColor: '#1e40af',
    },
  ];
  
  let filteredPromotions = [];
  
  if (position === 'home') {
    filteredPromotions = mockHomePromotions;
  } else {
    return [];
  }
  
  if (limit && limit > 0) {
    filteredPromotions = filteredPromotions.slice(0, limit);
  }
  
  return filteredPromotions;
};
