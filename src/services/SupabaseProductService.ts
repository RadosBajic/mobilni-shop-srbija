
import { supabase } from '@/lib/supabase';
import { Product } from '@/components/Products/ProductCard';
import { AdminProduct } from './ProductService';

// Define Supabase table types
export type SupabaseProduct = {
  id: string;
  title_sr: string;
  title_en: string;
  price: number;
  old_price: number | null;
  image: string;
  category: string;
  is_new: boolean;
  is_on_sale: boolean;
  sku: string;
  stock: number;
  status: 'active' | 'outOfStock' | 'draft';
  description_sr: string | null;
  description_en: string | null;
  created_at: string;
  updated_at: string;
};

// Convert Supabase product to frontend Product format
const mapToProduct = (product: SupabaseProduct): Product => ({
  id: product.id,
  title: {
    sr: product.title_sr,
    en: product.title_en
  },
  price: product.price,
  oldPrice: product.old_price,
  image: product.image,
  category: product.category,
  isNew: product.is_new,
  isOnSale: product.is_on_sale,
});

// Convert Supabase product to AdminProduct format
const mapToAdminProduct = (product: SupabaseProduct): AdminProduct => ({
  ...mapToProduct(product),
  sku: product.sku,
  stock: product.stock,
  status: product.status,
  descriptionSr: product.description_sr || '',
  descriptionEn: product.description_en || '',
  description: '', // Will be updated based on language
});

// Convert ProductFormData to Supabase format
const mapToSupabaseProduct = (formData: any): Omit<SupabaseProduct, 'created_at' | 'updated_at'> => ({
  id: formData.id || crypto.randomUUID(),
  title_sr: formData.nameSr,
  title_en: formData.nameEn,
  price: formData.price,
  old_price: formData.oldPrice,
  image: formData.image || '',
  category: formData.category,
  is_new: formData.isNew,
  is_on_sale: formData.isOnSale,
  sku: formData.sku,
  stock: formData.stock,
  status: formData.status,
  description_sr: formData.descriptionSr || null,
  description_en: formData.descriptionEn || null,
});

// Supabase Product Service
export const SupabaseProductService = {
  getProducts: async (
    category?: string, 
    limit?: number,
    isOnSale?: boolean,
    isNew?: boolean
  ): Promise<Product[]> => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (isOnSale !== undefined) {
        query = query.eq('is_on_sale', isOnSale);
      }
      
      if (isNew !== undefined) {
        query = query.eq('is_new', isNew);
      }
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return (data as SupabaseProduct[]).map(mapToProduct);
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },
  
  getFeaturedProducts: async (limit = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or('is_on_sale.eq.true,is_new.eq.true')
        .limit(limit);
      
      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }
      
      return (data as SupabaseProduct[]).map(mapToProduct);
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      throw error;
    }
  },
  
  getNewArrivals: async (limit = 4): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('is_new', true)
        .limit(limit);
      
      if (error) {
        console.error('Error fetching new arrivals:', error);
        throw error;
      }
      
      return (data as SupabaseProduct[]).map(mapToProduct);
    } catch (error) {
      console.error('Error in getNewArrivals:', error);
      throw error;
    }
  },
  
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product by ID:', error);
        if (error.code === 'PGRST116') {
          // "No rows returned" error - product not found
          return null;
        }
        throw error;
      }
      
      return mapToProduct(data as SupabaseProduct);
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  },
  
  getProductsByIds: async (ids: string[]): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);
      
      if (error) {
        console.error('Error fetching products by IDs:', error);
        throw error;
      }
      
      return (data as SupabaseProduct[]).map(mapToProduct);
    } catch (error) {
      console.error('Error in getProductsByIds:', error);
      throw error;
    }
  },
  
  getRelatedProducts: async (productId: string, limit = 4): Promise<Product[]> => {
    try {
      // First, get the category of the current product
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('category')
        .eq('id', productId)
        .single();
      
      if (productError) {
        console.error('Error fetching product category:', productError);
        throw productError;
      }
      
      // Then get related products in the same category
      const { data: relatedProducts, error: relatedError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('category', product.category)
        .neq('id', productId)
        .limit(limit);
      
      if (relatedError) {
        console.error('Error fetching related products:', relatedError);
        throw relatedError;
      }
      
      let related = (relatedProducts as SupabaseProduct[]).map(mapToProduct);
      
      // If we don't have enough related products, add some others
      if (related.length < limit) {
        const { data: otherProducts, error: otherError } = await supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .neq('category', product.category)
          .neq('id', productId)
          .limit(limit - related.length);
        
        if (otherError) {
          console.error('Error fetching other products:', otherError);
          throw otherError;
        }
        
        related = [...related, ...(otherProducts as SupabaseProduct[]).map(mapToProduct)];
      }
      
      return related;
    } catch (error) {
      console.error('Error in getRelatedProducts:', error);
      throw error;
    }
  },
  
  getAdminProducts: async (): Promise<AdminProduct[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching admin products:', error);
        throw error;
      }
      
      return (data as SupabaseProduct[]).map(mapToAdminProduct);
    } catch (error) {
      console.error('Error in getAdminProducts:', error);
      throw error;
    }
  },
  
  createProduct: async (formData: any): Promise<AdminProduct> => {
    try {
      const supabaseData = mapToSupabaseProduct(formData);
      
      const { data, error } = await supabase
        .from('products')
        .insert(supabaseData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }
      
      return mapToAdminProduct(data as SupabaseProduct);
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },
  
  updateProduct: async (id: string, formData: any): Promise<AdminProduct> => {
    try {
      const supabaseData = mapToSupabaseProduct({ ...formData, id });
      
      const { data, error } = await supabase
        .from('products')
        .update(supabaseData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      return mapToAdminProduct(data as SupabaseProduct);
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },
  
  bulkDeleteProducts: async (ids: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', ids);
      
      if (error) {
        console.error('Error bulk deleting products:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in bulkDeleteProducts:', error);
      throw error;
    }
  },
  
  getProductStatus: async (id: string): Promise<'active' | 'outOfStock' | 'draft'> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('status')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product status:', error);
        throw error;
      }
      
      return data.status;
    } catch (error) {
      console.error('Error in getProductStatus:', error);
      throw error;
    }
  },
  
  updateProductStatus: async (id: string, status: 'active' | 'outOfStock' | 'draft'): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating product status:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in updateProductStatus:', error);
      throw error;
    }
  },
  
  exportProducts: async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error exporting products:', error);
        throw error;
      }
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error in exportProducts:', error);
      throw error;
    }
  },
  
  importProducts: async (jsonData: string): Promise<boolean> => {
    try {
      const products = JSON.parse(jsonData) as SupabaseProduct[];
      
      if (!Array.isArray(products)) {
        throw new Error('Invalid import data format');
      }
      
      // First, we'll delete all existing products
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', 'dummy_id_that_doesnt_exist'); // Delete all rows
      
      if (deleteError) {
        console.error('Error deleting existing products:', deleteError);
        throw deleteError;
      }
      
      // Then, insert all imported products
      const { error: insertError } = await supabase
        .from('products')
        .insert(products);
      
      if (insertError) {
        console.error('Error importing products:', insertError);
        throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error in importProducts:', error);
      throw error;
    }
  }
};
