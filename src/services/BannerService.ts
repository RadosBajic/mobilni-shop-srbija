
import { api } from '@/lib/api';
import { BannerType, PromotionType } from '@/types/banners';

const mapToBanner = (banner: any): BannerType => ({
  id: banner.id,
  title: {
    sr: banner.title_sr,
    en: banner.title_en
  },
  description: {
    sr: banner.description_sr || '',
    en: banner.description_en || ''
  },
  image: banner.image || '',
  targetUrl: banner.target_url || '#',
  isActive: banner.is_active,
  position: banner.position,
  order: banner.order,
  startDate: banner.start_date,
  endDate: banner.end_date
});

const mapToPromotion = (promo: any): PromotionType => ({
  id: promo.id,
  title: {
    sr: promo.title_sr,
    en: promo.title_en
  },
  description: {
    sr: promo.description_sr || '',
    en: promo.description_en || ''
  },
  image: promo.image || '',
  targetUrl: promo.target_url || '#',
  isActive: promo.is_active,
  position: promo.position,
  order: promo.order,
  discount: promo.discount,
  startDate: promo.start_date,
  endDate: promo.end_date
});

export const BannerService = {
  getBanners: async (position?: 'home' | 'category'): Promise<BannerType[]> => {
    try {
      const banners = await api.getBanners(position);
      return banners.map(mapToBanner);
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },
  
  getPromotions: async (position?: 'home' | 'category'): Promise<PromotionType[]> => {
    try {
      const promotions = await api.getPromotions(position);
      return promotions.map(mapToPromotion);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },
  
  createBanner: async (bannerData: {
    titleSr: string;
    titleEn: string;
    descriptionSr?: string;
    descriptionEn?: string;
    image: string;
    targetUrl: string;
    isActive?: boolean;
    position: 'home' | 'category';
    order: number;
    startDate?: string;
    endDate?: string;
  }): Promise<BannerType> => {
    try {
      const banner = await api.createBanner(bannerData);
      return mapToBanner(banner);
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },
  
  updateBanner: async (id: string, bannerData: Partial<{
    titleSr: string;
    titleEn: string;
    descriptionSr?: string;
    descriptionEn?: string;
    image: string;
    targetUrl: string;
    isActive?: boolean;
    position: 'home' | 'category';
    order: number;
    startDate?: string;
    endDate?: string;
  }>): Promise<BannerType> => {
    try {
      const banner = await api.updateBanner(id, bannerData);
      return mapToBanner(banner);
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  },
  
  deleteBanner: async (id: string): Promise<boolean> => {
    try {
      return await api.deleteBanner(id);
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  },
  
  createPromotion: async (promoData: {
    titleSr: string;
    titleEn: string;
    descriptionSr?: string;
    descriptionEn?: string;
    image: string;
    targetUrl: string;
    isActive?: boolean;
    position: 'home' | 'category';
    order: number;
    discount?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PromotionType> => {
    try {
      const promo = await api.createPromotion(promoData);
      return mapToPromotion(promo);
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },
  
  updatePromotion: async (id: string, promoData: Partial<{
    titleSr: string;
    titleEn: string;
    descriptionSr?: string;
    descriptionEn?: string;
    image: string;
    targetUrl: string;
    isActive?: boolean;
    position: 'home' | 'category';
    order: number;
    discount?: number;
    startDate?: string;
    endDate?: string;
  }>): Promise<PromotionType> => {
    try {
      const promo = await api.updatePromotion(id, promoData);
      return mapToPromotion(promo);
    } catch (error) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  },
  
  deletePromotion: async (id: string): Promise<boolean> => {
    try {
      return await api.deletePromotion(id);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  }
};
