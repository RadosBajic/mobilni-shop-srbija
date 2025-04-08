
// This is a mock service that would be replaced with an actual API in a real application
import { BannerType, PromotionType } from '@/types/banners';

// Mock storage
let banners: BannerType[] = [
  {
    id: 'b1',
    title: {
      sr: 'Spring Sale',
      en: 'Spring Sale',
    },
    description: {
      sr: 'Uštedite do 50% na odabranim artiklima',
      en: 'Save up to 50% on selected items',
    },
    image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=1600&auto=format&fit=crop',
    targetUrl: '/promotions/spring-sale',
    isActive: true,
    position: 'hero',
    order: 1,
  },
  {
    id: 'b2',
    title: {
      sr: 'Novi Proizvodi',
      en: 'New Arrivals',
    },
    description: {
      sr: 'Pogledajte naše najnovije proizvode',
      en: 'Check out our latest products',
    },
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=1600&auto=format&fit=crop',
    targetUrl: '/new-arrivals',
    isActive: true,
    position: 'hero',
    order: 2,
  },
  {
    id: 'b3',
    title: {
      sr: 'Besplatna Dostava',
      en: 'Free Shipping',
    },
    description: {
      sr: 'Za sve porudžbine preko 5000 RSD',
      en: 'On all orders over 5000 RSD',
    },
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1600&auto=format&fit=crop',
    targetUrl: '/shipping-info',
    isActive: true,
    position: 'promo',
    order: 1,
  },
];

let promotions: PromotionType[] = [
  {
    id: 'p1',
    title: {
      sr: 'iPhone Dodatna Oprema',
      en: 'iPhone Accessories',
    },
    description: {
      sr: 'Premium maske, punjači i više',
      en: 'Premium cases, chargers, and more',
    },
    image: 'https://images.unsplash.com/photo-1605464375649-e3a730196d39?q=80&w=500&auto=format&fit=crop',
    targetUrl: '/categories/iphone-accessories',
    isActive: true,
    position: 'home',
    order: 1,
  },
  {
    id: 'p2',
    title: {
      sr: 'Samsung Kolekcija',
      en: 'Samsung Collection',
    },
    description: {
      sr: 'Ekskluzivna dodatna oprema za Galaxy uređaje',
      en: 'Exclusive accessories for Galaxy devices',
    },
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=500&auto=format&fit=crop',
    targetUrl: '/categories/samsung-accessories',
    isActive: true,
    position: 'home',
    order: 2,
  },
];

export const BannerService = {
  // Banner methods
  getBanners: (position?: string): Promise<BannerType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredBanners = position 
          ? banners.filter(b => b.isActive && b.position === position)
          : banners.filter(b => b.isActive);
        
        // Sort by order field
        const sortedBanners = [...filteredBanners].sort((a, b) => a.order - b.order);
        resolve(sortedBanners);
      }, 300);
    });
  },
  
  getBannerById: (id: string): Promise<BannerType | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const banner = banners.find(b => b.id === id);
        resolve(banner || null);
      }, 300);
    });
  },
  
  createBanner: (banner: Omit<BannerType, 'id'>): Promise<BannerType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBanner = {
          ...banner,
          id: `b${banners.length + 1}`,
        };
        banners.push(newBanner);
        resolve(newBanner);
      }, 300);
    });
  },
  
  updateBanner: (id: string, updates: Partial<BannerType>): Promise<BannerType | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = banners.findIndex(b => b.id === id);
        if (index !== -1) {
          banners[index] = { ...banners[index], ...updates };
          resolve(banners[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
  
  deleteBanner: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = banners.length;
        banners = banners.filter(b => b.id !== id);
        resolve(banners.length < initialLength);
      }, 300);
    });
  },
  
  // Promotion methods
  getPromotions: (position?: string): Promise<PromotionType[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredPromotions = position 
          ? promotions.filter(p => p.isActive && p.position === position)
          : promotions.filter(p => p.isActive);
        
        // Sort by order field
        const sortedPromotions = [...filteredPromotions].sort((a, b) => a.order - b.order);
        resolve(sortedPromotions);
      }, 300);
    });
  },
  
  getPromotionById: (id: string): Promise<PromotionType | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const promotion = promotions.find(p => p.id === id);
        resolve(promotion || null);
      }, 300);
    });
  },
  
  createPromotion: (promotion: Omit<PromotionType, 'id'>): Promise<PromotionType> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPromotion = {
          ...promotion,
          id: `p${promotions.length + 1}`,
        };
        promotions.push(newPromotion);
        resolve(newPromotion);
      }, 300);
    });
  },
  
  updatePromotion: (id: string, updates: Partial<PromotionType>): Promise<PromotionType | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = promotions.findIndex(p => p.id === id);
        if (index !== -1) {
          promotions[index] = { ...promotions[index], ...updates };
          resolve(promotions[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
  
  deletePromotion: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = promotions.length;
        promotions = promotions.filter(p => p.id !== id);
        resolve(promotions.length < initialLength);
      }, 300);
    });
  },
};
