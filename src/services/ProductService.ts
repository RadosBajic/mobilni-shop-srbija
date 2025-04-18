
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

// Extended product interface with admin fields
export interface AdminProduct extends Product {
  sku: string;
  stock: number;
  status: 'active' | 'outOfStock' | 'draft';
  description?: string;
  descriptionSr?: string;
  descriptionEn?: string;
}

// Convert products to admin format
const adminProducts: AdminProduct[] = products.map(product => ({
  ...product,
  sku: `SKU-${product.id}`,
  stock: Math.floor(Math.random() * 100),
  status: product.oldPrice ? 'active' : (Math.random() > 0.8 ? 'draft' : 'active'),
  description: 'Product description goes here',
  descriptionSr: 'Opis proizvoda ide ovde',
  descriptionEn: 'Product description goes here',
}));

// Function to convert ProductFormData to Product
const convertFormDataToProduct = (formData: any): Product => {
  return {
    id: formData.id || `p${products.length + 1}`,
    title: {
      sr: formData.nameSr,
      en: formData.nameEn
    },
    price: formData.price,
    oldPrice: formData.oldPrice || null,
    image: formData.image || 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=500&auto=format&fit=crop',
    category: formData.category,
    isNew: formData.isNew,
    isOnSale: formData.isOnSale
  };
};

// Function to convert ProductFormData to AdminProduct
const convertFormDataToAdminProduct = (formData: any): AdminProduct => {
  return {
    ...convertFormDataToProduct(formData),
    sku: formData.sku,
    stock: formData.stock,
    status: formData.status,
    description: formData.description || '',
    descriptionSr: formData.descriptionSr || '',
    descriptionEn: formData.descriptionEn || ''
  };
};

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
  },
  
  getAdminProducts: (): Promise<AdminProduct[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...adminProducts]);
      }, 300);
    });
  },
  
  createProduct: (formData: any): Promise<AdminProduct> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create product ID if not provided
        const newId = formData.id || `p${products.length + 1}`;
        
        // Create product object for both arrays
        const newProduct = convertFormDataToProduct({
          ...formData,
          id: newId
        });
        
        const newAdminProduct = convertFormDataToAdminProduct({
          ...formData,
          id: newId
        });
        
        // Add to both arrays
        products.push(newProduct);
        adminProducts.push(newAdminProduct);
        
        console.log('Created new product:', newProduct);
        console.log('Current products:', products);
        
        resolve(newAdminProduct);
      }, 300);
    });
  },
  
  updateProduct: (id: string, formData: any): Promise<AdminProduct> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Find the product in admin products
        const adminIndex = adminProducts.findIndex(p => p.id === id);
        
        if (adminIndex === -1) {
          reject(new Error('Product not found'));
          return;
        }
        
        // Update the admin product
        const updatedAdminProduct = {
          ...adminProducts[adminIndex],
          ...convertFormDataToAdminProduct({...formData, id})
        };
        
        adminProducts[adminIndex] = updatedAdminProduct;
        
        // Find and update the product in regular products array
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
          products[productIndex] = convertFormDataToProduct({...formData, id});
        }
        
        console.log('Updated product:', updatedAdminProduct);
        console.log('Current products:', products);
        
        resolve(updatedAdminProduct);
      }, 300);
    });
  },
  
  deleteProduct: (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = adminProducts.length;
        
        // Filter out the product with the given id
        const filteredAdminProducts = adminProducts.filter(p => p.id !== id);
        
        // If the length has changed, we found and removed the product
        const success = filteredAdminProducts.length < initialLength;
        
        if (success) {
          // Update the adminProducts array
          adminProducts.length = 0;
          adminProducts.push(...filteredAdminProducts);
          
          // Also update the regular products array
          const filteredProducts = products.filter(p => p.id !== id);
          products.length = 0;
          products.push(...filteredProducts);
          
          console.log('Deleted product with ID:', id);
          console.log('Current products:', products);
        }
        
        resolve(success);
      }, 300);
    });
  },
  
  bulkDeleteProducts: (ids: string[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter out products with the given ids
        const filteredAdminProducts = adminProducts.filter(p => !ids.includes(p.id));
        const filteredProducts = products.filter(p => !ids.includes(p.id));
        
        // Update the arrays
        adminProducts.length = 0;
        adminProducts.push(...filteredAdminProducts);
        
        products.length = 0;
        products.push(...filteredProducts);
        
        console.log('Deleted products with IDs:', ids);
        console.log('Current products:', products);
        
        resolve(true);
      }, 300);
    });
  },
  
  getProductStatus: (id: string): Promise<'active' | 'outOfStock' | 'draft'> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = adminProducts.find(p => p.id === id);
        
        if (!product) {
          reject(new Error('Product not found'));
          return;
        }
        
        resolve(product.status);
      }, 300);
    });
  },
  
  updateProductStatus: (id: string, status: 'active' | 'outOfStock' | 'draft'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = adminProducts.find(p => p.id === id);
        
        if (!product) {
          reject(new Error('Product not found'));
          return;
        }
        
        product.status = status;
        resolve(true);
      }, 300);
    });
  },
  
  exportProducts: (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a JSON string of all products
        const exportData = JSON.stringify(adminProducts, null, 2);
        
        // In a real application, this would trigger a file download
        // For now, we just return the JSON string
        resolve(exportData);
      }, 300);
    });
  },
  
  importProducts: (data: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Parse the imported data
          const importedProducts = JSON.parse(data) as AdminProduct[];
          
          if (!Array.isArray(importedProducts)) {
            reject(new Error('Invalid import data format'));
            return;
          }
          
          // Replace the current products with imported products
          adminProducts.length = 0;
          adminProducts.push(...importedProducts);
          
          // Update the regular products array as well
          products.length = 0;
          products.push(...importedProducts.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            oldPrice: p.oldPrice,
            image: p.image,
            category: p.category,
            isNew: p.isNew,
            isOnSale: p.isOnSale
          })));
          
          console.log('Imported products:', importedProducts);
          console.log('Current products:', products);
          
          resolve(true);
        } catch (error) {
          reject(new Error('Failed to parse import data'));
        }
      }, 300);
    });
  }
};
