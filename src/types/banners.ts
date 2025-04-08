
export interface MultiLanguageText {
  sr: string;
  en: string;
}

export interface BannerType {
  id: string;
  title: MultiLanguageText;
  description: MultiLanguageText;
  image: string;
  targetUrl: string;
  isActive: boolean;
  position: 'hero' | 'promo';
  order: number;
  startDate?: string; // Optional date when the banner should start showing
  endDate?: string;   // Optional date when the banner should stop showing
}

export interface PromotionType {
  id: string;
  title: MultiLanguageText;
  description: MultiLanguageText;
  image: string;
  targetUrl: string;
  isActive: boolean;
  position: 'home' | 'category';
  order: number;
  startDate?: string; // Optional date when the promotion should start showing
  endDate?: string;   // Optional date when the promotion should stop showing
  discount?: number;  // Optional discount percentage for the promotion
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
