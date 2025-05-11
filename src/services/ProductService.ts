
import { SupabaseProductService } from '@/services/SupabaseProductService';
import { Product, AdminProduct, GetProductsParams } from '@/types/product';

export { AdminProduct, GetProductsParams };

export const ProductService = {
  getProducts: async (params: GetProductsParams): Promise<Product[]> => {
    try {
      return await SupabaseProductService.getProducts(
        params.category,
        params.limit,
        params.isOnSale,
        params.isNew
      );
    } catch (error) {
      console.error('ProductService getProducts error:', error);
      return [];
    }
  },

  getFeaturedProducts: async (limit: number = 4): Promise<Product[]> => {
    try {
      return await SupabaseProductService.getFeaturedProducts(limit);
    } catch (error) {
      console.error('ProductService getFeaturedProducts error:', error);
      return [];
    }
  },

  getNewArrivals: async (limit: number = 4): Promise<Product[]> => {
    try {
      return await SupabaseProductService.getNewArrivals(limit);
    } catch (error) {
      console.error('ProductService getNewArrivals error:', error);
      return [];
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      return await SupabaseProductService.getProductById(id);
    } catch (error) {
      console.error('ProductService getProductById error:', error);
      return null;
    }
  },

  getProductsByIds: async (ids: string[]): Promise<Product[]> => {
    try {
      return await SupabaseProductService.getProductsByIds(ids);
    } catch (error) {
      console.error('ProductService getProductsByIds error:', error);
      return [];
    }
  },

  getRelatedProducts: async (productId: string, limit: number = 4): Promise<Product[]> => {
    try {
      return await SupabaseProductService.getRelatedProducts(productId, limit);
    } catch (error) {
      console.error('ProductService getRelatedProducts error:', error);
      return [];
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      return await SupabaseProductService.searchProducts(query);
    } catch (error) {
      console.error('ProductService searchProducts error:', error);
      return [];
    }
  },

  getAdminProducts: async (): Promise<AdminProduct[]> => {
    try {
      return await SupabaseProductService.getAdminProducts();
    } catch (error) {
      console.error('ProductService getAdminProducts error:', error);
      return [];
    }
  },

  createProduct: async (formData: any): Promise<AdminProduct> => {
    try {
      return await SupabaseProductService.createProduct(formData);
    } catch (error) {
      console.error('ProductService createProduct error:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, formData: any): Promise<AdminProduct> => {
    try {
      return await SupabaseProductService.updateProduct(id, formData);
    } catch (error) {
      console.error('ProductService updateProduct error:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      return await SupabaseProductService.deleteProduct(id);
    } catch (error) {
      console.error('ProductService deleteProduct error:', error);
      throw error;
    }
  },

  bulkDeleteProducts: async (ids: string[]): Promise<boolean> => {
    try {
      return await SupabaseProductService.bulkDeleteProducts(ids);
    } catch (error) {
      console.error('ProductService bulkDeleteProducts error:', error);
      throw error;
    }
  }
};
