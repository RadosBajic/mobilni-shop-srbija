
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
}
