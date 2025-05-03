
import { BannerType, PromotionType } from '@/types/banners';
import { executeQuery } from '@/lib/neon';

export const SupabaseBannerService = {
  // Banner metode
  getBanners: async (position?: 'hero' | 'promo'): Promise<BannerType[]> => {
    try {
      let query = 'SELECT * FROM banners';
      const params: any[] = [];
      
      if (position) {
        query += ' WHERE position = $1';
        params.push(position);
      }
      
      query += ' ORDER BY "order" ASC';
      
      const data = await executeQuery(query, params);
      
      return data.map((banner: any) => ({
        id: banner.id,
        title: {
          sr: banner.title_sr,
          en: banner.title_en
        },
        description: {
          sr: banner.description_sr,
          en: banner.description_en
        },
        image: banner.image || '',
        targetUrl: banner.target_url || '',
        isActive: banner.is_active || false,
        position: banner.position as 'hero' | 'promo',
        order: banner.order,
        startDate: banner.start_date || undefined,
        endDate: banner.end_date || undefined
      }));
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  },

  getBannerById: async (id: string): Promise<BannerType | null> => {
    try {
      const query = 'SELECT * FROM banners WHERE id = $1';
      const data = await executeQuery(query, [id]);
      
      if (!data || data.length === 0) return null;
      const banner = data[0];
      
      return {
        id: banner.id,
        title: {
          sr: banner.title_sr,
          en: banner.title_en
        },
        description: {
          sr: banner.description_sr,
          en: banner.description_en
        },
        image: banner.image || '',
        targetUrl: banner.target_url || '',
        isActive: banner.is_active || false,
        position: banner.position as 'hero' | 'promo',
        order: banner.order,
        startDate: banner.start_date || undefined,
        endDate: banner.end_date || undefined
      };
    } catch (error) {
      console.error('Error fetching banner by id:', error);
      throw error;
    }
  },

  createBanner: async (banner: Omit<BannerType, 'id'>): Promise<BannerType> => {
    try {
      const query = `
        INSERT INTO banners (
          title_sr, title_en, description_sr, description_en, 
          image, target_url, is_active, position, "order", 
          start_date, end_date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;
      
      const params = [
        banner.title.sr,
        banner.title.en,
        banner.description.sr,
        banner.description.en,
        banner.image,
        banner.targetUrl,
        banner.isActive,
        banner.position,
        banner.order,
        banner.startDate,
        banner.endDate
      ];
      
      const data = await executeQuery(query, params);
      const newBanner = data[0];
      
      return {
        id: newBanner.id,
        title: {
          sr: newBanner.title_sr,
          en: newBanner.title_en
        },
        description: {
          sr: newBanner.description_sr,
          en: newBanner.description_en
        },
        image: newBanner.image || '',
        targetUrl: newBanner.target_url || '',
        isActive: newBanner.is_active || false,
        position: newBanner.position as 'hero' | 'promo',
        order: newBanner.order,
        startDate: newBanner.start_date || undefined,
        endDate: newBanner.end_date || undefined
      };
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  updateBanner: async (id: string, updates: Partial<BannerType>): Promise<BannerType> => {
    try {
      // Dinamički kreirajmo deo upita za ažuriranje
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;
      
      if (updates.title) {
        updateFields.push(`title_sr = $${paramCount}`);
        values.push(updates.title.sr);
        paramCount++;
        
        updateFields.push(`title_en = $${paramCount}`);
        values.push(updates.title.en);
        paramCount++;
      }
      
      if (updates.description) {
        updateFields.push(`description_sr = $${paramCount}`);
        values.push(updates.description.sr);
        paramCount++;
        
        updateFields.push(`description_en = $${paramCount}`);
        values.push(updates.description.en);
        paramCount++;
      }
      
      if ('image' in updates) {
        updateFields.push(`image = $${paramCount}`);
        values.push(updates.image);
        paramCount++;
      }
      
      if ('targetUrl' in updates) {
        updateFields.push(`target_url = $${paramCount}`);
        values.push(updates.targetUrl);
        paramCount++;
      }
      
      if ('isActive' in updates) {
        updateFields.push(`is_active = $${paramCount}`);
        values.push(updates.isActive);
        paramCount++;
      }
      
      if ('position' in updates) {
        updateFields.push(`position = $${paramCount}`);
        values.push(updates.position);
        paramCount++;
      }
      
      if ('order' in updates) {
        updateFields.push(`"order" = $${paramCount}`);
        values.push(updates.order);
        paramCount++;
      }
      
      if ('startDate' in updates) {
        updateFields.push(`start_date = $${paramCount}`);
        values.push(updates.startDate);
        paramCount++;
      }
      
      if ('endDate' in updates) {
        updateFields.push(`end_date = $${paramCount}`);
        values.push(updates.endDate);
        paramCount++;
      }
      
      // Dodajmo ID na kraj parametara
      values.push(id);
      
      // Kreiraj i izvrši upit
      const query = `
        UPDATE banners SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const data = await executeQuery(query, values);
      const updatedBanner = data[0];
      
      return {
        id: updatedBanner.id,
        title: {
          sr: updatedBanner.title_sr,
          en: updatedBanner.title_en
        },
        description: {
          sr: updatedBanner.description_sr,
          en: updatedBanner.description_en
        },
        image: updatedBanner.image || '',
        targetUrl: updatedBanner.target_url || '',
        isActive: updatedBanner.is_active || false,
        position: updatedBanner.position as 'hero' | 'promo',
        order: updatedBanner.order,
        startDate: updatedBanner.start_date || undefined,
        endDate: updatedBanner.end_date || undefined
      };
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },

  deleteBanner: async (id: string): Promise<boolean> => {
    try {
      const query = 'DELETE FROM banners WHERE id = $1';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },

  // Promotion metode
  getPromotions: async (position?: 'home' | 'category'): Promise<PromotionType[]> => {
    try {
      let query = 'SELECT * FROM promotions';
      const params: any[] = [];
      
      if (position) {
        query += ' WHERE position = $1';
        params.push(position);
      }
      
      query += ' ORDER BY "order" ASC';
      
      const data = await executeQuery(query, params);
      
      return data.map((promo: any) => ({
        id: promo.id,
        title: {
          sr: promo.title_sr,
          en: promo.title_en
        },
        description: {
          sr: promo.description_sr,
          en: promo.description_en
        },
        image: promo.image || '',
        targetUrl: promo.target_url || '',
        isActive: promo.is_active || false,
        position: promo.position as 'home' | 'category',
        order: promo.order,
        discount: promo.discount,
        startDate: promo.start_date || undefined,
        endDate: promo.end_date || undefined
      }));
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  },

  getPromotionById: async (id: string): Promise<PromotionType | null> => {
    try {
      const query = 'SELECT * FROM promotions WHERE id = $1';
      const data = await executeQuery(query, [id]);
      
      if (!data || data.length === 0) return null;
      const promo = data[0];
      
      return {
        id: promo.id,
        title: {
          sr: promo.title_sr,
          en: promo.title_en
        },
        description: {
          sr: promo.description_sr,
          en: promo.description_en
        },
        image: promo.image || '',
        targetUrl: promo.target_url || '',
        isActive: promo.is_active || false,
        position: promo.position as 'home' | 'category',
        order: promo.order,
        discount: promo.discount,
        startDate: promo.start_date || undefined,
        endDate: promo.end_date || undefined
      };
    } catch (error) {
      console.error('Error fetching promotion:', error);
      throw error;
    }
  },

  createPromotion: async (promotion: Omit<PromotionType, 'id'>): Promise<PromotionType> => {
    try {
      const query = `
        INSERT INTO promotions (
          title_sr, title_en, description_sr, description_en, 
          image, target_url, is_active, position, "order", 
          discount, start_date, end_date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const params = [
        promotion.title.sr,
        promotion.title.en,
        promotion.description.sr,
        promotion.description.en,
        promotion.image,
        promotion.targetUrl,
        promotion.isActive,
        promotion.position,
        promotion.order,
        promotion.discount,
        promotion.startDate,
        promotion.endDate
      ];
      
      const data = await executeQuery(query, params);
      const newPromo = data[0];
      
      return {
        id: newPromo.id,
        title: {
          sr: newPromo.title_sr,
          en: newPromo.title_en
        },
        description: {
          sr: newPromo.description_sr,
          en: newPromo.description_en
        },
        image: newPromo.image || '',
        targetUrl: newPromo.target_url || '',
        isActive: newPromo.is_active || false,
        position: newPromo.position as 'home' | 'category',
        order: newPromo.order,
        discount: newPromo.discount,
        startDate: newPromo.start_date || undefined,
        endDate: newPromo.end_date || undefined
      };
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  updatePromotion: async (id: string, updates: Partial<PromotionType>): Promise<PromotionType> => {
    try {
      // Dinamički kreirajmo deo upita za ažuriranje
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;
      
      if (updates.title) {
        updateFields.push(`title_sr = $${paramCount}`);
        values.push(updates.title.sr);
        paramCount++;
        
        updateFields.push(`title_en = $${paramCount}`);
        values.push(updates.title.en);
        paramCount++;
      }
      
      if (updates.description) {
        updateFields.push(`description_sr = $${paramCount}`);
        values.push(updates.description.sr);
        paramCount++;
        
        updateFields.push(`description_en = $${paramCount}`);
        values.push(updates.description.en);
        paramCount++;
      }
      
      if ('image' in updates) {
        updateFields.push(`image = $${paramCount}`);
        values.push(updates.image);
        paramCount++;
      }
      
      if ('targetUrl' in updates) {
        updateFields.push(`target_url = $${paramCount}`);
        values.push(updates.targetUrl);
        paramCount++;
      }
      
      if ('isActive' in updates) {
        updateFields.push(`is_active = $${paramCount}`);
        values.push(updates.isActive);
        paramCount++;
      }
      
      if ('position' in updates) {
        updateFields.push(`position = $${paramCount}`);
        values.push(updates.position);
        paramCount++;
      }
      
      if ('order' in updates) {
        updateFields.push(`"order" = $${paramCount}`);
        values.push(updates.order);
        paramCount++;
      }
      
      if ('discount' in updates) {
        updateFields.push(`discount = $${paramCount}`);
        values.push(updates.discount);
        paramCount++;
      }
      
      if ('startDate' in updates) {
        updateFields.push(`start_date = $${paramCount}`);
        values.push(updates.startDate);
        paramCount++;
      }
      
      if ('endDate' in updates) {
        updateFields.push(`end_date = $${paramCount}`);
        values.push(updates.endDate);
        paramCount++;
      }
      
      // Dodajmo ID na kraj parametara
      values.push(id);
      
      // Kreiraj i izvrši upit
      const query = `
        UPDATE promotions SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const data = await executeQuery(query, values);
      const updatedPromo = data[0];
      
      return {
        id: updatedPromo.id,
        title: {
          sr: updatedPromo.title_sr,
          en: updatedPromo.title_en
        },
        description: {
          sr: updatedPromo.description_sr,
          en: updatedPromo.description_en
        },
        image: updatedPromo.image || '',
        targetUrl: updatedPromo.target_url || '',
        isActive: updatedPromo.is_active || false,
        position: updatedPromo.position as 'home' | 'category',
        order: updatedPromo.order,
        discount: updatedPromo.discount,
        startDate: updatedPromo.start_date || undefined,
        endDate: updatedPromo.end_date || undefined
      };
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  },

  deletePromotion: async (id: string): Promise<boolean> => {
    try {
      const query = 'DELETE FROM promotions WHERE id = $1';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  }
};
