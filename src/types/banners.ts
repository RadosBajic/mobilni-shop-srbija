
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
  position: 'home' | 'category' | 'hero' | 'promo';
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

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  date: string;
  read: boolean;
  link?: string;
}
