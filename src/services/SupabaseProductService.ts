
import { executeQuery } from '@/lib/neon';
import { Product } from '@/components/Products/ProductCard';
import { AdminProduct } from './ProductService';

// Definicija tipova za bazu
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

// Konvertovanje proizvoda iz baze u frontend format
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

// Konvertovanje proizvoda iz baze u AdminProduct format
const mapToAdminProduct = (product: SupabaseProduct): AdminProduct => ({
  ...mapToProduct(product),
  sku: product.sku,
  stock: product.stock,
  status: product.status,
  descriptionSr: product.description_sr || '',
  descriptionEn: product.description_en || '',
  description: '', // Biće ažurirano na osnovu jezika
});

// Konvertovanje ProductFormData u format za bazu
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

// Neon Product Service
export const SupabaseProductService = {
  getProducts: async (
    category?: string, 
    limit?: number,
    isOnSale?: boolean,
    isNew?: boolean
  ): Promise<Product[]> => {
    try {
      let query = 'SELECT * FROM products WHERE status = $1';
      const params: any[] = ['active'];
      let paramIndex = 2;
      
      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }
      
      if (isOnSale !== undefined) {
        query += ` AND is_on_sale = $${paramIndex}`;
        params.push(isOnSale);
        paramIndex++;
      }
      
      if (isNew !== undefined) {
        query += ` AND is_new = $${paramIndex}`;
        params.push(isNew);
        paramIndex++;
      }
      
      if (limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(limit);
      }
      
      const data = await executeQuery(query, params);
      return data.map(mapToProduct);
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },
  
  getFeaturedProducts: async (limit = 4): Promise<Product[]> => {
    try {
      const query = `
        SELECT * FROM products 
        WHERE status = $1 
        AND (is_on_sale = true OR is_new = true) 
        LIMIT $2
      `;
      const data = await executeQuery(query, ['active', limit]);
      return data.map(mapToProduct);
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      throw error;
    }
  },
  
  getNewArrivals: async (limit = 4): Promise<Product[]> => {
    try {
      const query = `
        SELECT * FROM products 
        WHERE status = $1 AND is_new = true
        LIMIT $2
      `;
      const data = await executeQuery(query, ['active', limit]);
      return data.map(mapToProduct);
    } catch (error) {
      console.error('Error in getNewArrivals:', error);
      throw error;
    }
  },
  
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const query = 'SELECT * FROM products WHERE id = $1';
      const data = await executeQuery(query, [id]);
      
      if (!data || data.length === 0) return null;
      return mapToProduct(data[0]);
    } catch (error) {
      console.error('Error in getProductById:', error);
      throw error;
    }
  },
  
  getProductsByIds: async (ids: string[]): Promise<Product[]> => {
    try {
      if (!ids.length) return [];
      
      // Kreiramo dinamički IN upit sa parametrima
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      const query = `SELECT * FROM products WHERE id IN (${placeholders})`;
      
      const data = await executeQuery(query, ids);
      return data.map(mapToProduct);
    } catch (error) {
      console.error('Error in getProductsByIds:', error);
      throw error;
    }
  },
  
  getRelatedProducts: async (productId: string, limit = 4): Promise<Product[]> => {
    try {
      // Prvo dobijamo kategoriju trenutnog proizvoda
      const productQuery = 'SELECT category FROM products WHERE id = $1';
      const productData = await executeQuery(productQuery, [productId]);
      
      if (!productData || productData.length === 0) {
        throw new Error('Product not found');
      }
      
      // Zatim dobijamo povezane proizvode iste kategorije
      const relatedQuery = `
        SELECT * FROM products 
        WHERE status = $1 
        AND category = $2 
        AND id != $3 
        LIMIT $4
      `;
      
      const relatedData = await executeQuery(relatedQuery, [
        'active', 
        productData[0].category, 
        productId, 
        limit
      ]);
      
      let related = relatedData.map(mapToProduct);
      
      // Ako nemamo dovoljno povezanih proizvoda, dodajemo neke druge
      if (related.length < limit) {
        const otherQuery = `
          SELECT * FROM products 
          WHERE status = $1 
          AND category != $2 
          AND id != $3 
          LIMIT $4
        `;
        
        const otherData = await executeQuery(otherQuery, [
          'active', 
          productData[0].category, 
          productId, 
          limit - related.length
        ]);
        
        related = [...related, ...otherData.map(mapToProduct)];
      }
      
      return related;
    } catch (error) {
      console.error('Error in getRelatedProducts:', error);
      throw error;
    }
  },
  
  getAdminProducts: async (): Promise<AdminProduct[]> => {
    try {
      const query = 'SELECT * FROM products ORDER BY created_at DESC';
      const data = await executeQuery(query);
      return data.map(mapToAdminProduct);
    } catch (error) {
      console.error('Error in getAdminProducts:', error);
      throw error;
    }
  },
  
  createProduct: async (formData: any): Promise<AdminProduct> => {
    try {
      const product = mapToSupabaseProduct(formData);
      console.log('Creating product:', product);
      
      // Kreiranje upita sa navedenim kolonama i vrednostima
      const columns = Object.keys(product).join(', ');
      const placeholders = Object.keys(product)
        .map((_, i) => `$${i + 1}`)
        .join(', ');
      
      const query = `
        INSERT INTO products (${columns}) 
        VALUES (${placeholders})
        RETURNING *
      `;
      
      const values = Object.values(product);
      
      // Pokušaj da izvršimo upit direktno na serveru ako je moguće
      console.log('Executing query:', query);
      console.log('With values:', values);
      
      const data = await executeQuery(query, values);
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create product: No data returned');
      }
      
      console.log('Product created successfully:', data[0]);
      return mapToAdminProduct(data[0]);
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },
  
  updateProduct: async (id: string, formData: any): Promise<AdminProduct> => {
    try {
      const product = mapToSupabaseProduct({ ...formData, id });
      console.log('Updating product:', product);
      
      // Dinamički kreiramo update upit
      const updateFields = Object.keys(product)
        .filter(key => key !== 'id') // Ne ažuriramo ID
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');
      
      const query = `
        UPDATE products 
        SET ${updateFields}
        WHERE id = $1
        RETURNING *
      `;
      
      const values = [id, ...Object.values(product).filter((_, i) => 
        Object.keys(product)[i] !== 'id'
      )];
      
      const data = await executeQuery(query, values);
      
      if (!data || data.length === 0) {
        throw new Error('Failed to update product: No data returned');
      }
      
      console.log('Product updated successfully:', data[0]);
      return mapToAdminProduct(data[0]);
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      console.log('Deleting product:', id);
      const query = 'DELETE FROM products WHERE id = $1';
      await executeQuery(query, [id]);
      console.log('Product deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },
  
  bulkDeleteProducts: async (ids: string[]): Promise<boolean> => {
    try {
      if (!ids.length) return true;
      
      console.log('Bulk deleting products:', ids);
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      const query = `DELETE FROM products WHERE id IN (${placeholders})`;
      
      await executeQuery(query, ids);
      console.log('Products deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in bulkDeleteProducts:', error);
      throw error;
    }
  },
  
  getProductStatus: async (id: string): Promise<'active' | 'outOfStock' | 'draft'> => {
    try {
      const query = 'SELECT status FROM products WHERE id = $1';
      const data = await executeQuery(query, [id]);
      
      if (!data || data.length === 0) {
        throw new Error('Product not found');
      }
      
      return data[0].status;
    } catch (error) {
      console.error('Error in getProductStatus:', error);
      throw error;
    }
  },
  
  updateProductStatus: async (id: string, status: 'active' | 'outOfStock' | 'draft'): Promise<boolean> => {
    try {
      console.log('Updating product status:', id, status);
      const query = 'UPDATE products SET status = $1 WHERE id = $2';
      await executeQuery(query, [status, id]);
      console.log('Product status updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateProductStatus:', error);
      throw error;
    }
  },
  
  exportProducts: async (): Promise<string> => {
    try {
      const query = 'SELECT * FROM products';
      const data = await executeQuery(query);
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
      
      console.log('Importing products:', products.length);
      
      // U stvarnom sistemu, ovde bismo koristili transakciju
      // Za našu demonstraciju, iteriraćemo kroz proizvode i ubaciti ih jedan po jedan
      for (const product of products) {
        const columns = Object.keys(product).join(', ');
        const placeholders = Object.keys(product)
          .map((_, i) => `$${i + 1}`)
          .join(', ');
        
        const query = `
          INSERT INTO products (${columns}) 
          VALUES (${placeholders})
          ON CONFLICT (id) DO UPDATE SET 
            title_sr = EXCLUDED.title_sr,
            title_en = EXCLUDED.title_en,
            price = EXCLUDED.price,
            old_price = EXCLUDED.old_price,
            image = EXCLUDED.image,
            category = EXCLUDED.category,
            is_new = EXCLUDED.is_new,
            is_on_sale = EXCLUDED.is_on_sale,
            sku = EXCLUDED.sku,
            stock = EXCLUDED.stock,
            status = EXCLUDED.status,
            description_sr = EXCLUDED.description_sr,
            description_en = EXCLUDED.description_en,
            updated_at = NOW()
        `;
        
        await executeQuery(query, Object.values(product));
      }
      
      console.log('Products imported successfully');
      return true;
    } catch (error) {
      console.error('Error in importProducts:', error);
      throw error;
    }
  }
};
