
// This is a mock service that would be replaced with an actual API in a real application
import { BannerType, PromotionType } from '@/types/banners';

// Mock storage
let banners: BannerType[] = [
  {
    id: 'b1',
    title: {
      sr: 'Prolećna Akcija',
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
    discount: 15,
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
    discount: 20,
  },
];

// This would come from a real DB in a production app
let products = [
  {
    id: 'p1',
    title: {
      sr: 'iPhone 14 Pro silikonska maska - crna',
      en: 'iPhone 14 Pro silicone case - black'
    },
    price: 2499,
    oldPrice: 2999,
    image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=500&auto=format&fit=crop',
    category: 'phone-cases',
    isNew: true,
    isOnSale: true,
  },
  {
    id: 'p2',
    title: {
      sr: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
      en: 'Samsung Galaxy S23 Ultra glass screen protector'
    },
    price: 1499,
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=500&auto=format&fit=crop',
    category: 'screen-protectors',
    isNew: true,
    isOnSale: false,
  },
  {
    id: 'p3',
    title: {
      sr: 'Bežične Bluetooth slušalice sa mikrofonom',
      en: 'Wireless Bluetooth headphones with microphone'
    },
    price: 4999,
    oldPrice: 5999,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500&auto=format&fit=crop',
    category: 'headphones',
    isNew: false,
    isOnSale: true,
  },
  {
    id: 'p4',
    title: {
      sr: 'Brzi punjač USB-C 65W',
      en: 'Fast charger USB-C 65W'
    },
    price: 3499,
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1628815113969-0487917e8b76?q=80&w=500&auto=format&fit=crop',
    category: 'chargers',
    isNew: false,
    isOnSale: false,
  },
  {
    id: 'p5',
    title: {
      sr: 'Premium Lightning kabl - 2m',
      en: 'Premium Lightning cable - 2m'
    },
    price: 1299,
    oldPrice: 1699,
    image: 'https://images.unsplash.com/photo-1606292943133-cc1b0ff0e295?q=80&w=500&auto=format&fit=crop',
    category: 'cables',
    isNew: false,
    isOnSale: true,
  },
  {
    id: 'p6',
    title: {
      sr: 'Xiaomi Redmi Note 12 transparentna maska',
      en: 'Xiaomi Redmi Note 12 transparent case'
    },
    price: 1199,
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1609388449750-b504ef6d27f4?q=80&w=500&auto=format&fit=crop',
    category: 'phone-cases',
    isNew: true,
    isOnSale: false,
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
  
  // Product methods (added to simulate connection between admin and frontend)
  getProducts: (category?: string, limit?: number): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredProducts = category 
          ? products.filter(p => p.category === category)
          : products;
          
        if (limit && filteredProducts.length > limit) {
          filteredProducts = filteredProducts.slice(0, limit);
        }
        
        resolve(filteredProducts);
      }, 300);
    });
  },
  
  getFeaturedProducts: (limit = 4): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For featured products, we'll return items that are on sale or new
        const featured = products.filter(p => p.isOnSale || p.isNew);
        const result = featured.slice(0, limit);
        resolve(result);
      }, 300);
    });
  },
  
  getProductById: (id: string): Promise<any | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = products.find(p => p.id === id);
        resolve(product || null);
      }, 300);
    });
  },
};
