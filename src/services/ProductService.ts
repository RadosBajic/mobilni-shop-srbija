import { api } from '@/lib/api';
import { Product } from '@/components/Products/ProductCard';

export interface AdminProduct extends Product {
  sku: string;
  stock: number;
  status: 'active' | 'outOfStock' | 'draft';
  descriptionSr: string;
  descriptionEn: string;
  description: string; // Localized description based on current language
}

const mapToProduct = (product: any): Product => ({
  id: product.id,
  title: {
    sr: product.title_sr,
    en: product.title_en
  },
  price: parseFloat(product.price),
  oldPrice: product.old_price ? parseFloat(product.old_price) : null,
  image: product.image || '',
  category: product.category,
  isNew: product.is_new,
  isOnSale: product.is_on_sale,
});

const mapToAdminProduct = (product: any): AdminProduct => ({
  ...mapToProduct(product),
  sku: product.sku,
  stock: product.stock,
  status: product.status,
  descriptionSr: product.description_sr || '',
  descriptionEn: product.description_en || '',
  description: '', // Will be set based on language
});

export const ProductService = {
  getProducts: async (options: { category?: string, limit?: number, isOnSale?: boolean, isNew?: boolean } = {}): Promise<Product[]> => {
    try {
      const products = await api.getProducts(options);
      return products.map(mapToProduct);
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  getFeaturedProducts: async (limit = 4): Promise<Product[]> => {
    try {
      const products = await api.getProducts({ isOnSale: true, limit });
      return products.map(mapToProduct);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },
  
  getNewArrivals: async (limit = 4): Promise<Product[]> => {
    try {
      const products = await api.getProducts({ isNew: true, limit });
      return products.map(mapToProduct);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  },
  
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      // Fixed: Use query instead of a non-existent getProductById
      const query = 'SELECT * FROM products WHERE id = $1';
      const data = await api.query(query, [id]);
      
      if (!data || data.length === 0) return null;
      return mapToProduct(data[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },
  
  getProductsByCategory: async (categorySlug: string, limit?: number): Promise<Product[]> => {
    try {
      const products = await api.getProducts({ category: categorySlug, limit });
      return products.map(mapToProduct);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },
  
  // Admin methods
  getAdminProducts: async (): Promise<AdminProduct[]> => {
    try {
      // Fixed: Use query instead of non-existent getAdminProducts
      const query = 'SELECT * FROM products ORDER BY created_at DESC';
      const products = await api.query(query);
      return products.map(mapToAdminProduct);
    } catch (error) {
      console.error('Error fetching admin products:', error);
      return [];
    }
  },
  
  createProduct: async (formData: {
    nameSr: string;
    nameEn: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    isNew: boolean;
    isOnSale: boolean;
    sku: string;
    stock: number;
    status: 'active' | 'outOfStock' | 'draft';
    descriptionSr: string;
    descriptionEn: string;
  }): Promise<AdminProduct> => {
    try {
      const productData = {
        titleSr: formData.nameSr,
        titleEn: formData.nameEn,
        price: formData.price,
        oldPrice: formData.oldPrice,
        image: formData.image,
        category: formData.category,
        isNew: formData.isNew,
        isOnSale: formData.isOnSale,
        sku: formData.sku,
        stock: formData.stock,
        status: formData.status,
        descriptionSr: formData.descriptionSr,
        descriptionEn: formData.descriptionEn
      };
      
      const product = await api.createProduct(productData);
      return mapToAdminProduct(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id: string, formData: Partial<{
    nameSr: string;
    nameEn: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    isNew: boolean;
    isOnSale: boolean;
    sku: string;
    stock: number;
    status: 'active' | 'outOfStock' | 'draft';
    descriptionSr: string;
    descriptionEn: string;
  }>): Promise<AdminProduct> => {
    try {
      const productData: any = {};
      
      if ('nameSr' in formData) productData.titleSr = formData.nameSr;
      if ('nameEn' in formData) productData.titleEn = formData.nameEn;
      if ('price' in formData) productData.price = formData.price;
      if ('oldPrice' in formData) productData.oldPrice = formData.oldPrice;
      if ('image' in formData) productData.image = formData.image;
      if ('category' in formData) productData.category = formData.category;
      if ('isNew' in formData) productData.isNew = formData.isNew;
      if ('isOnSale' in formData) productData.isOnSale = formData.isOnSale;
      if ('sku' in formData) productData.sku = formData.sku;
      if ('stock' in formData) productData.stock = formData.stock;
      if ('status' in formData) productData.status = formData.status;
      if ('descriptionSr' in formData) productData.descriptionSr = formData.descriptionSr;
      if ('descriptionEn' in formData) productData.descriptionEn = formData.descriptionEn;
      
      const product = await api.updateProduct(id, productData);
      return mapToAdminProduct(product);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      return await api.deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
