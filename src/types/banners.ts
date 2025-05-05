
export interface BannerType {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  image: string;
  targetUrl: string;
  isActive: boolean;
  position: 'home' | 'category';
  order: number;
  startDate?: string;
  endDate?: string;
}

export interface PromotionType {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  image: string;
  targetUrl: string;
  isActive: boolean;
  position: 'home' | 'category';
  order: number;
  discount?: number;
  startDate?: string;
  endDate?: string;
}
