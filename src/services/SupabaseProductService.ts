
import { supabase } from '@/lib/supabase';
import { Product, AdminProduct } from '@/types/product';
import { 
  mapDbProductToProduct, 
  mapDbProductToAdminProduct 
} from '@/services/productMappers';
import {
  getBasicProducts,
  getFeaturedProductsQuery,
  getNewArrivalsQuery,
  getProductByIdQuery,
  getProductsByIdsQuery,
  getRelatedProductsQuery,
  searchProductsQuery,
  getAdminProductsQuery
} from '@/services/productQueries';

export const SupabaseProductService = {
  // Basic product fetching
  getProducts: async (
    category?: string, 
    limit?: number, 
    isOnSale?: boolean, 
    isNew?: boolean
  ): Promise<Product[]> => {
    try {
      const { data, error } = await getBasicProducts(supabase, category, limit, isOnSale, isNew);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToProduct(item));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  // Get featured products
  getFeaturedProducts: async (limit: number = 4): Promise<Product[]> => {
    try {
      const { data, error } = await getFeaturedProductsQuery(supabase, limit);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToProduct(item));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },
  
  // Get new arrivals
  getNewArrivals: async (limit: number = 4): Promise<Product[]> => {
    try {
      const { data, error } = await getNewArrivalsQuery(supabase, limit);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToProduct(item));
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },
  
  // Get product by ID
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await getProductByIdQuery(supabase, id);
      
      if (error) {
        throw error;
      }
      
      return data ? mapDbProductToProduct(data) : null;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  },
  
  // Get products by IDs
  getProductsByIds: async (ids: string[]): Promise<Product[]> => {
    try {
      const { data, error } = await getProductsByIdsQuery(supabase, ids);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToProduct(item));
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      return [];
    }
  },
  
  // Get related products
  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    try {
      const { data, error } = await getRelatedProductsQuery(supabase, productId, limit);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToProduct(item));
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  },
  
  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const { data, error } = await searchProductsQuery(supabase, query);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToProduct(item));
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
  
  // Admin functions
  getAdminProducts: async (): Promise<AdminProduct[]> => {
    try {
      const { data, error } = await getAdminProductsQuery(supabase);
      
      if (error) {
        throw error;
      }

      return (data || []).map(item => mapDbProductToAdminProduct(item));
    } catch (error) {
      console.error('Error fetching admin products:', error);
      return [];
    }
  },
  
  // Create product
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
      
      return mapDbProductToAdminProduct(data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Update product
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
      
      return mapDbProductToAdminProduct(data);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  // Delete product
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
  
  // Bulk delete products
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

  // Export products
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

  // Import products
  importProducts: async (jsonData: string): Promise<boolean> => {
    try {
      const products = JSON.parse(jsonData);
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid data format. Expected an array of products.');
      }
      
      // First, prepare the products data to match Supabase table structure
      const formattedProducts = [];
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        formattedProducts.push({
          title_sr: product.title_sr || product.nameSr || product.title?.sr || product.name || '',
          title_en: product.title_en || product.nameEn || product.title?.en || product.name || '',
          sku: product.sku || '',
          category: product.category || '',
          price: product.price || 0,
          old_price: product.old_price || product.oldPrice || null,
          stock: product.stock || 0,
          status: product.status || 'active',
          description_sr: product.description_sr || product.descriptionSr || '',
          description_en: product.description_en || product.descriptionEn || '',
          is_new: product.is_new !== undefined ? product.is_new : 
                 product.isNew !== undefined ? product.isNew : false,
          is_on_sale: product.is_on_sale !== undefined ? product.is_on_sale : 
                     product.isOnSale !== undefined ? product.isOnSale : false,
          image: product.image_url || product.image || null,
        });
      }
      
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
