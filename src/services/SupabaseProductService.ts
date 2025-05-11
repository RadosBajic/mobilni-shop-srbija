import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/Products/ProductCard';
import { AdminProduct } from '@/services/ProductService';

export const SupabaseProductService = {
  getProducts: async (
    category?: string, 
    limit?: number, 
    isOnSale?: boolean, 
    isNew?: boolean
  ): Promise<Product[]> => {
    try {
      let query = supabase.from('products')
        .select('*')
        .eq('status', 'active');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (isOnSale) {
        query = query.eq('is_on_sale', true);
      }
      
      if (isNew) {
        query = query.eq('is_new', true);
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Return mock data if production is not yet connected
      return getMockProducts(category, limit, isOnSale, isNew);
    }
  },
  
  getFeaturedProducts: async (limit: number = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .limit(limit);
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
      }));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      
      // Return mock data
      return getMockProducts(undefined, limit, true, false);
    }
  },
  
  getNewArrivals: async (limit: number = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_new', true)
        .limit(limit);
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
      }));
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      
      // Return mock data
      return getMockProducts(undefined, limit, false, true);
    }
  },
  
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase.from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }

      return {
        id: data.id,
        title: {
          en: data.title_en || '',
          sr: data.title_sr || '',
        },
        price: data.price || 0,
        oldPrice: data.old_price || null,
        image: data.image || '',
        category: data.category || '',
        isNew: data.is_new || false,
        isOnSale: data.is_on_sale || false,
      };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      
      // Return mock product
      const mockProducts = getMockProducts();
      return mockProducts.find(p => p.id === id) || null;
    }
  },
  
  getProductsByIds: async (ids: string[]): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products')
        .select('*')
        .in('id', ids);
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
      }));
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      
      // Return mock products
      const mockProducts = getMockProducts();
      return mockProducts.filter(p => ids.includes(p.id));
    }
  },
  
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    try {
      // First get the category of the current product
      const { data: productData, error: productError } = await supabase.from('products')
        .select('category')
        .eq('id', productId)
        .single();
      
      if (productError) {
        throw productError;
      }
      
      if (!productData) {
        return [];
      }
      
      // Then get related products from the same category
      const { data, error } = await supabase.from('products')
        .select('*')
        .eq('status', 'active')
        .eq('category', productData.category)
        .neq('id', productId)
        .limit(limit);
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
      }));
    } catch (error) {
      console.error('Error fetching related products:', error);
      
      // Return mock products
      return getMockProducts(undefined, limit);
    }
  },
  
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const { data, error } = await supabase.from('products')
        .select('*')
        .eq('status', 'active')
        .or(`title_en.ilike.%${query}%,title_sr.ilike.%${query}%`);
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
      }));
    } catch (error) {
      console.error('Error searching products:', error);
      
      // Return mock products
      const mockProducts = getMockProducts();
      return mockProducts.filter(p => 
        p.title.en.toLowerCase().includes(query.toLowerCase()) || 
        p.title.sr.toLowerCase().includes(query.toLowerCase())
      );
    }
  },
  
  getAdminProducts: async (): Promise<AdminProduct[]> => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        title: {
          en: item.title_en || '',
          sr: item.title_sr || '',
        },
        price: item.price || 0,
        oldPrice: item.old_price || null,
        image: item.image || '',
        category: item.category || '',
        isNew: item.is_new || false,
        isOnSale: item.is_on_sale || false,
        sku: item.sku || '',
        stock: item.stock || 0,
        status: (item.status as 'active' | 'outOfStock' | 'draft') || 'draft',
        descriptionSr: item.description_sr || '',
        descriptionEn: item.description_en || '',
        description: item.description || '',
      }));
    } catch (error) {
      console.error('Error fetching admin products:', error);
      
      // Return mock products for admin
      return getMockAdminProducts();
    }
  },
  
  createProduct: async (formData: any): Promise<AdminProduct> => {
    try {
      const productData = {
        title_sr: formData.nameSr || formData.name || '',
        title_en: formData.nameEn || formData.name || '',
        sku: formData.sku || '',
        category: formData.category || '',
        price: formData.price || 0,
        old_price: formData.oldPrice || null,
        stock: formData.stock || 0,
        status: formData.status || 'active',
        description_sr: formData.descriptionSr || formData.description || '',
        description_en: formData.descriptionEn || formData.description || '',
        is_new: formData.isNew !== undefined ? formData.isNew : false,
        is_on_sale: formData.isOnSale !== undefined ? formData.isOnSale : false,
        image: formData.image || null
      };
      
      const { data, error } = await supabase.from('products').insert(productData).select().single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        title: {
          en: data.title_en || '',
          sr: data.title_sr || '',
        },
        price: data.price,
        oldPrice: data.old_price,
        image: data.image,
        category: data.category,
        isNew: data.is_new,
        isOnSale: data.is_on_sale,
        sku: data.sku,
        stock: data.stock,
        status: data.status,
        descriptionSr: data.description_sr,
        descriptionEn: data.description_en,
        description: data.description_sr || data.description_en || '',
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id: string, formData: any): Promise<AdminProduct> => {
    try {
      const productData: Record<string, any> = {};
      
      if (formData.nameSr !== undefined) productData.title_sr = formData.nameSr;
      if (formData.nameEn !== undefined) productData.title_en = formData.nameEn;
      if (formData.name !== undefined && !productData.title_sr) productData.title_sr = formData.name;
      if (formData.name !== undefined && !productData.title_en) productData.title_en = formData.name;
      if (formData.sku !== undefined) productData.sku = formData.sku;
      if (formData.category !== undefined) productData.category = formData.category;
      if (formData.price !== undefined) productData.price = formData.price;
      if (formData.oldPrice !== undefined) productData.old_price = formData.oldPrice;
      if (formData.stock !== undefined) productData.stock = formData.stock;
      if (formData.status !== undefined) productData.status = formData.status;
      if (formData.descriptionSr !== undefined) productData.description_sr = formData.descriptionSr;
      if (formData.descriptionEn !== undefined) productData.description_en = formData.descriptionEn;
      if (formData.description !== undefined && !productData.description_sr) productData.description_sr = formData.description;
      if (formData.description !== undefined && !productData.description_en) productData.description_en = formData.description;
      if (formData.isNew !== undefined) productData.is_new = formData.isNew;
      if (formData.isOnSale !== undefined) productData.is_on_sale = formData.isOnSale;
      if (formData.image !== undefined) productData.image = formData.image;
      
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        title: {
          en: data.title_en || '',
          sr: data.title_sr || '',
        },
        price: data.price,
        oldPrice: data.old_price,
        image: data.image,
        category: data.category,
        isNew: data.is_new,
        isOnSale: data.is_on_sale,
        sku: data.sku,
        stock: data.stock,
        status: data.status,
        descriptionSr: data.description_sr,
        descriptionEn: data.description_en,
        description: data.description_sr || data.description_en || '',
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
  
  bulkDeleteProducts: async (ids: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase.from('products').delete().in('id', ids);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  },

  exportProducts: async (): Promise<string> => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        throw error;
      }
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  },

  importProducts: async (jsonData: string): Promise<boolean> => {
    try {
      const products = JSON.parse(jsonData);
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid data format. Expected an array of products.');
      }
      
      // First, prepare the products data to match Supabase table structure
      const formattedProducts = products.map(product => ({
        title: product.title || product.name,
        title_sr: product.title_sr || product.nameSr || product.title || product.name,
        title_en: product.title_en || product.nameEn || product.title || product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        old_price: product.old_price || product.oldPrice,
        stock: product.stock,
        status: product.status,
        description: product.description,
        description_sr: product.description_sr || product.descriptionSr,
        description_en: product.description_en || product.descriptionEn,
        is_new: product.is_new || product.isNew || false,
        is_on_sale: product.is_on_sale || product.isOnSale || false,
        image_url: product.image_url || product.image,
      }));
      
      const { error } = await supabase.from('products').upsert(formattedProducts);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  },
};

// Helper functions for mock data
const getMockProducts = (category?: string, limit?: number, isOnSale?: boolean, isNew?: boolean): Product[] => {
  const mockProducts: Product[] = [
    {
      id: '1',
      title: {
        sr: 'iPhone 14 Pro Max Silikonska Maska',
        en: 'iPhone 14 Pro Max Silicone Case',
      },
      price: 2499,
      oldPrice: 2999,
      image: 'https://picsum.photos/seed/phone1/400/400',
      category: 'phone-cases',
      isNew: true,
      isOnSale: true,
    },
    {
      id: '2',
      title: {
        sr: 'Samsung Galaxy S23 Ultra Zaštitno staklo',
        en: 'Samsung Galaxy S23 Ultra Screen Protector',
      },
      price: 1499,
      oldPrice: null,
      image: 'https://picsum.photos/seed/phone2/400/400',
      category: 'screen-protectors',
      isNew: true,
      isOnSale: false,
    },
    {
      id: '3',
      title: {
        sr: 'Apple Lightning kabl 2m',
        en: 'Apple Lightning Cable 2m',
      },
      price: 1999,
      oldPrice: 2499,
      image: 'https://picsum.photos/seed/phone3/400/400',
      category: 'chargers',
      isNew: false,
      isOnSale: true,
    },
    {
      id: '4',
      title: {
        sr: 'Univerzalno držač za mobilni',
        en: 'Universal Phone Car Mount',
      },
      price: 1299,
      oldPrice: null,
      image: 'https://picsum.photos/seed/phone4/400/400',
      category: 'accessories',
      isNew: false,
      isOnSale: false,
    },
    {
      id: '5',
      title: {
        sr: 'Bluetooth bežične slušalice',
        en: 'Bluetooth Wireless Earbuds',
      },
      price: 3999,
      oldPrice: 4999,
      image: 'https://picsum.photos/seed/phone5/400/400',
      category: 'audio',
      isNew: true,
      isOnSale: true,
    },
    {
      id: '6',
      title: {
        sr: 'Eksterni prenosivi punjač 10000mAh',
        en: 'Power Bank 10000mAh',
      },
      price: 2999,
      oldPrice: null,
      image: 'https://picsum.photos/seed/phone6/400/400',
      category: 'chargers',
      isNew: false,
      isOnSale: false,
    },
    {
      id: '7',
      title: {
        sr: 'USB-C brzi punjač 30W',
        en: 'USB-C Fast Charger 30W',
      },
      price: 1999,
      oldPrice: 2499,
      image: 'https://picsum.photos/seed/phone7/400/400',
      category: 'chargers',
      isNew: false,
      isOnSale: true,
    },
    {
      id: '8',
      title: {
        sr: 'Xiaomi Redmi Note 12 Flip maska',
        en: 'Xiaomi Redmi Note 12 Flip Case',
      },
      price: 1499,
      oldPrice: null,
      image: 'https://picsum.photos/seed/phone8/400/400',
      category: 'phone-cases',
      isNew: true,
      isOnSale: false,
    },
    {
      id: '9',
      title: {
        sr: 'Bežični punjač 15W',
        en: 'Wireless Charger 15W',
      },
      price: 2499,
      oldPrice: 2999,
      image: 'https://picsum.photos/seed/phone9/400/400',
      category: 'chargers',
      isNew: true,
      isOnSale: true,
    },
    {
      id: '10',
      title: {
        sr: 'Selfie štap sa bluetooth kontrolom',
        en: 'Selfie Stick with Bluetooth Control',
      },
      price: 1699,
      oldPrice: null,
      image: 'https://picsum.photos/seed/phone10/400/400',
      category: 'accessories',
      isNew: false,
      isOnSale: false,
    },
  ];
  
  let filteredProducts = [...mockProducts];
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (isOnSale === true) {
    filteredProducts = filteredProducts.filter(p => p.isOnSale);
  }
  
  if (isNew === true) {
    filteredProducts = filteredProducts.filter(p => p.isNew);
  }
  
  if (limit && limit > 0) {
    filteredProducts = filteredProducts.slice(0, limit);
  }
  
  return filteredProducts;
};

const getMockAdminProducts = (): AdminProduct[] => {
  return getMockProducts().map(product => ({
    ...product,
    sku: `SKU-${product.id}`,
    stock: Math.floor(Math.random() * 100) + 1,
    status: 'active' as 'active' | 'outOfStock' | 'draft',
    descriptionSr: 'Opis proizvoda na srpskom.',
    descriptionEn: 'Product description in English.',
    description: 'Detaljan opis proizvoda / Product details',
  }));
};
