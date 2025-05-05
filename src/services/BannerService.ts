
import { api } from '@/lib/api';
import { BannerType, PromotionType } from '@/types/banners';

const mapToBannerType = (banner: any): BannerType => ({
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

const mapToPromotionType = (promo: any): PromotionType => ({
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
  getBanners: async (position?: 'hero' | 'promo'): Promise<BannerType[]> => {
    try {
      const banners = await api.getBanners(position);
      return banners.map(mapToBannerType);
    } catch (error) {
      console.error('Error fetching banners:', error);
      return [];
    }
  },

  getPromotions: async (position?: 'home' | 'category'): Promise<PromotionType[]> => {
    try {
      const promotions = await api.getPromotions(position);
      return promotions.map(mapToPromotionType);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
  },

  // Admin methods
  createBanner: async (bannerData: Omit<BannerType, 'id'>): Promise<BannerType> => {
    try {
      const data = {
        titleSr: bannerData.title.sr,
        titleEn: bannerData.title.en,
        descriptionSr: bannerData.description.sr,
        descriptionEn: bannerData.description.en,
        image: bannerData.image,
        targetUrl: bannerData.targetUrl,
        isActive: bannerData.isActive,
        position: bannerData.position,
        order: bannerData.order,
        startDate: bannerData.startDate,
        endDate: bannerData.endDate
      };

      const banner = await api.createBanner(data);
      return mapToBannerType(banner);
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  },

  updateBanner: async (id: string, bannerData: Partial<BannerType>): Promise<BannerType> => {
    try {
      const data: any = {};

      if (bannerData.title) {
        data.titleSr = bannerData.title.sr;
        data.titleEn = bannerData.title.en;
      }

      if (bannerData.description) {
        data.descriptionSr = bannerData.description.sr;
        data.descriptionEn = bannerData.description.en;
      }

      if ('image' in bannerData) data.image = bannerData.image;
      if ('targetUrl' in bannerData) data.targetUrl = bannerData.targetUrl;
      if ('isActive' in bannerData) data.isActive = bannerData.isActive;
      if ('position' in bannerData) data.position = bannerData.position;
      if ('order' in bannerData) data.order = bannerData.order;
      if ('startDate' in bannerData) data.startDate = bannerData.startDate;
      if ('endDate' in bannerData) data.endDate = bannerData.endDate;

      const banner = await api.updateBanner(id, data);
      return mapToBannerType(banner);
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

  createPromotion: async (promotionData: Omit<PromotionType, 'id'>): Promise<PromotionType> => {
    try {
      const data = {
        titleSr: promotionData.title.sr,
        titleEn: promotionData.title.en,
        descriptionSr: promotionData.description.sr,
        descriptionEn: promotionData.description.en,
        image: promotionData.image,
        targetUrl: promotionData.targetUrl,
        isActive: promotionData.isActive,
        position: promotionData.position,
        order: promotionData.order,
        discount: promotionData.discount,
        startDate: promotionData.startDate,
        endDate: promotionData.endDate
      };

      const promotion = await api.createPromotion(data);
      return mapToPromotionType(promotion);
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  updatePromotion: async (id: string, promotionData: Partial<PromotionType>): Promise<PromotionType> => {
    try {
      const data: any = {};

      if (promotionData.title) {
        data.titleSr = promotionData.title.sr;
        data.titleEn = promotionData.title.en;
      }

      if (promotionData.description) {
        data.descriptionSr = promotionData.description.sr;
        data.descriptionEn = promotionData.description.en;
      }

      if ('image' in promotionData) data.image = promotionData.image;
      if ('targetUrl' in promotionData) data.targetUrl = promotionData.targetUrl;
      if ('isActive' in promotionData) data.isActive = promotionData.isActive;
      if ('position' in promotionData) data.position = promotionData.position;
      if ('order' in promotionData) data.order = promotionData.order;
      if ('discount' in promotionData) data.discount = promotionData.discount;
      if ('startDate' in promotionData) data.startDate = promotionData.startDate;
      if ('endDate' in promotionData) data.endDate = promotionData.endDate;

      const promotion = await api.updatePromotion(id, data);
      return mapToPromotionType(promotion);
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
