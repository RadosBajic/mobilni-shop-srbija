
import { Product } from '@/components/Products/ProductCard';

// Mock products data
const products: Product[] = [
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
  {
    id: 'p7',
    title: {
      sr: 'Zaštitno staklo za Apple Watch',
      en: 'Protective glass for Apple Watch'
    },
    price: 1299,
    oldPrice: 1899,
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=500&auto=format&fit=crop',
    category: 'screen-protectors',
    isNew: false,
    isOnSale: true,
  },
  {
    id: 'p8',
    title: {
      sr: 'USB C na HDMI adapter',
      en: 'USB C to HDMI adapter'
    },
    price: 2799,
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1625242662167-a1cfa19397ad?q=80&w=500&auto=format&fit=crop',
    category: 'adapters',
    isNew: true,
    isOnSale: false,
  }
];

// This would be an actual API service in a real app
export const ProductService = {
  getProducts: (
    category?: string, 
    limit?: number,
    isOnSale?: boolean,
    isNew?: boolean
  ): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredProducts = [...products];
        
        if (category) {
          filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        
        if (isOnSale !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.isOnSale === isOnSale);
        }
        
        if (isNew !== undefined) {
          filteredProducts = filteredProducts.filter(p => p.isNew === isNew);
        }
        
        if (limit && filteredProducts.length > limit) {
          filteredProducts = filteredProducts.slice(0, limit);
        }
        
        resolve(filteredProducts);
      }, 300);
    });
  },
  
  getFeaturedProducts: (limit = 4): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // For featured products, we'll prioritize items that are on sale
        const onSale = products.filter(p => p.isOnSale);
        const newProducts = products.filter(p => p.isNew && !p.isOnSale);
        
        let featured = [...onSale, ...newProducts];
        if (limit && featured.length > limit) {
          featured = featured.slice(0, limit);
        }
        
        resolve(featured);
      }, 300);
    });
  },
  
  getNewArrivals: (limit = 4): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProducts = products.filter(p => p.isNew);
        let result = [...newProducts];
        
        if (limit && result.length > limit) {
          result = result.slice(0, limit);
        }
        
        resolve(result);
      }, 300);
    });
  },
  
  getProductById: (id: string): Promise<Product | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = products.find(p => p.id === id);
        resolve(product || null);
      }, 300);
    });
  },
  
  getProductsByIds: (ids: string[]): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundProducts = products.filter(p => ids.includes(p.id));
        resolve(foundProducts);
      }, 300);
    });
  },
  
  getRelatedProducts: (productId: string, limit = 4): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentProduct = products.find(p => p.id === productId);
        if (!currentProduct) {
          resolve([]);
          return;
        }
        
        // Find products in the same category
        let related = products.filter(p => 
          p.id !== productId && p.category === currentProduct.category
        );
        
        // If we don't have enough related products, add some others
        if (related.length < limit) {
          const others = products.filter(p => 
            p.id !== productId && p.category !== currentProduct.category
          );
          related = [...related, ...others];
        }
        
        if (related.length > limit) {
          related = related.slice(0, limit);
        }
        
        resolve(related);
      }, 300);
    });
  }
};
