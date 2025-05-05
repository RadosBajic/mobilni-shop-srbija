
import { executeQuery } from './neon';

// This is a wrapper around the executeQuery function that provides
// a more consistent API for the application to use
export const api = {
  // Generic query function
  query: async (query: string, params?: any[]) => {
    return executeQuery(query, params);
  },

  // Products
  getProducts: async (options: { category?: string, limit?: number, isOnSale?: boolean, isNew?: boolean } = {}) => {
    try {
      let query = 'SELECT * FROM products WHERE status = $1';
      const params: any[] = ['active'];
      let paramIndex = 2;

      if (options.category) {
        query += ` AND category = $${paramIndex}`;
        params.push(options.category);
        paramIndex++;
      }

      if (options.isOnSale !== undefined) {
        query += ` AND is_on_sale = $${paramIndex}`;
        params.push(options.isOnSale);
        paramIndex++;
      }

      if (options.isNew !== undefined) {
        query += ` AND is_new = $${paramIndex}`;
        params.push(options.isNew);
        paramIndex++;
      }

      if (options.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(options.limit);
      }

      return executeQuery(query, params);
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  },

  // Categories
  getCategories: async (isActive?: boolean) => {
    try {
      let query = 'SELECT * FROM categories';
      const params: any[] = [];
      
      if (isActive !== undefined) {
        query += ' WHERE is_active = $1';
        params.push(isActive);
      }
      
      query += ' ORDER BY display_order ASC';
      
      return executeQuery(query, params);
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  },

  getCategoryBySlug: async (slug: string) => {
    try {
      const query = 'SELECT * FROM categories WHERE slug = $1';
      const result = await executeQuery(query, [slug]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error);
      return null;
    }
  },

  createCategory: async (categoryData: any) => {
    try {
      const query = `
        INSERT INTO categories (
          name_sr, name_en, slug, description_sr, description_en,
          image, is_active, display_order
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;
      
      const params = [
        categoryData.nameSr,
        categoryData.nameEn,
        categoryData.slug,
        categoryData.descriptionSr,
        categoryData.descriptionEn,
        categoryData.image,
        categoryData.isActive,
        categoryData.displayOrder
      ];
      
      const result = await executeQuery(query, params);
      return result[0];
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, categoryData: any) => {
    try {
      // Build the update query dynamically based on what fields are provided
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      // Map fields to database columns
      const fieldMapping: Record<string, string> = {
        nameSr: 'name_sr',
        nameEn: 'name_en',
        slug: 'slug',
        descriptionSr: 'description_sr',
        descriptionEn: 'description_en',
        image: 'image',
        isActive: 'is_active',
        displayOrder: 'display_order',
      };
      
      // Add each field that is present in the input data
      for (const [key, dbField] of Object.entries(fieldMapping)) {
        if (key in categoryData) {
          updateFields.push(`${dbField} = $${paramCounter}`);
          values.push(categoryData[key]);
          paramCounter++;
        }
      }
      
      // If no fields to update, return the original category
      if (updateFields.length === 0) {
        const category = await executeQuery('SELECT * FROM categories WHERE id = $1', [id]);
        return category[0];
      }
      
      // Add update timestamp
      updateFields.push(`updated_at = NOW()`);
      
      // Add id as the last parameter
      values.push(id);
      
      const query = `
        UPDATE categories 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCounter}
        RETURNING *
      `;
      
      const result = await executeQuery(query, values);
      return result[0];
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
      const result = await executeQuery(query, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  },

  // Orders
  createOrder: async (orderData: any) => {
    try {
      const query = `
        INSERT INTO orders (
          customer_id, customer_name, customer_email, customer_phone, 
          shipping_address, items, total_amount, status, 
          payment_method, payment_status, notes
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *
      `;
      
      const params = [
        orderData.customerId,
        orderData.customerName,
        orderData.customerEmail,
        orderData.customerPhone,
        orderData.shippingAddress,
        orderData.items,
        orderData.totalAmount,
        orderData.status,
        orderData.paymentMethod,
        orderData.paymentStatus,
        orderData.notes
      ];
      
      const result = await executeQuery(query, params);
      return result[0];
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },

  getOrderById: async (id: string) => {
    try {
      const query = 'SELECT * FROM orders WHERE id = $1';
      const result = await executeQuery(query, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  },

  getOrders: async () => {
    try {
      const query = 'SELECT * FROM orders ORDER BY created_at DESC';
      return executeQuery(query);
    } catch (error) {
      console.error('Error in getOrders:', error);
      return [];
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const query = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
      const result = await executeQuery(query, [status, id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      return null;
    }
  },

  // Banners
  getBanners: async (position?: string) => {
    try {
      let query = 'SELECT * FROM banners';
      const params: any[] = [];
      
      if (position) {
        query += ' WHERE position = $1';
        params.push(position);
      }
      
      query += ' ORDER BY "order" ASC';
      
      return executeQuery(query, params);
    } catch (error) {
      console.error('Error in getBanners:', error);
      return [];
    }
  },

  createBanner: async (bannerData: any) => {
    try {
      const query = `
        INSERT INTO banners (
          title_sr, title_en, description_sr, description_en, image,
          target_url, is_active, position, "order", start_date, end_date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
        RETURNING *
      `;
      
      const params = [
        bannerData.titleSr,
        bannerData.titleEn,
        bannerData.descriptionSr,
        bannerData.descriptionEn,
        bannerData.image,
        bannerData.targetUrl,
        bannerData.isActive !== undefined ? bannerData.isActive : true,
        bannerData.position,
        bannerData.order,
        bannerData.startDate,
        bannerData.endDate
      ];
      
      const result = await executeQuery(query, params);
      return result[0];
    } catch (error) {
      console.error('Error in createBanner:', error);
      throw error;
    }
  },

  updateBanner: async (id: string, bannerData: any) => {
    try {
      // Build the update query dynamically
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      // Map fields to database columns
      const fieldMapping: Record<string, string> = {
        titleSr: 'title_sr',
        titleEn: 'title_en',
        descriptionSr: 'description_sr',
        descriptionEn: 'description_en',
        image: 'image',
        targetUrl: 'target_url',
        isActive: 'is_active',
        position: 'position',
        order: '"order"',
        startDate: 'start_date',
        endDate: 'end_date'
      };
      
      // Add each field that is present in the input data
      for (const [key, dbField] of Object.entries(fieldMapping)) {
        if (key in bannerData) {
          updateFields.push(`${dbField} = $${paramCounter}`);
          values.push(bannerData[key]);
          paramCounter++;
        }
      }
      
      // If no fields to update, return the original banner
      if (updateFields.length === 0) {
        const banner = await executeQuery('SELECT * FROM banners WHERE id = $1', [id]);
        return banner[0];
      }
      
      // Add update timestamp
      updateFields.push(`updated_at = NOW()`);
      
      // Add id as the last parameter
      values.push(id);
      
      const query = `
        UPDATE banners 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCounter}
        RETURNING *
      `;
      
      const result = await executeQuery(query, values);
      return result[0];
    } catch (error) {
      console.error('Error in updateBanner:', error);
      throw error;
    }
  },

  deleteBanner: async (id: string) => {
    try {
      const query = 'DELETE FROM banners WHERE id = $1 RETURNING *';
      const result = await executeQuery(query, [id]);
      return result.length > 0;
    } catch (error) {
      console.error('Error in deleteBanner:', error);
      throw error;
    }
  },

  // Promotions
  getPromotions: async (position?: string) => {
    try {
      let query = 'SELECT * FROM promotions';
      const params: any[] = [];
      
      if (position) {
        query += ' WHERE position = $1';
        params.push(position);
      }
      
      query += ' ORDER BY "order" ASC';
      
      return executeQuery(query, params);
    } catch (error) {
      console.error('Error in getPromotions:', error);
      return [];
    }
  },

  // Promotions Management
  createPromotion: async (promotionData: any) => {
    try {
      const query = `
        INSERT INTO promotions (
          title_sr, title_en, description_sr, description_en, image,
          target_url, is_active, position, "order", discount, start_date, end_date
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        RETURNING *
      `;
      
      const params = [
        promotionData.titleSr,
        promotionData.titleEn,
        promotionData.descriptionSr,
        promotionData.descriptionEn,
        promotionData.image,
        promotionData.targetUrl,
        promotionData.isActive !== undefined ? promotionData.isActive : true,
        promotionData.position,
        promotionData.order,
        promotionData.discount,
        promotionData.startDate,
        promotionData.endDate
      ];
      
      const result = await executeQuery(query, params);
      return result[0];
    } catch (error) {
      console.error('Error in createPromotion:', error);
      throw error;
    }
  },

  updatePromotion: async (id: string, promotionData: any) => {
    try {
      // Build the update query dynamically
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      // Map fields to database columns
      const fieldMapping: Record<string, string> = {
        titleSr: 'title_sr',
        titleEn: 'title_en',
        descriptionSr: 'description_sr',
        descriptionEn: 'description_en',
        image: 'image',
        targetUrl: 'target_url',
        isActive: 'is_active',
        position: 'position',
        order: '"order"',
        discount: 'discount',
        startDate: 'start_date',
        endDate: 'end_date'
      };
      
      // Add each field that is present in the input data
      for (const [key, dbField] of Object.entries(fieldMapping)) {
        if (key in promotionData) {
          updateFields.push(`${dbField} = $${paramCounter}`);
          values.push(promotionData[key]);
          paramCounter++;
        }
      }
      
      // If no fields to update, return the original promotion
      if (updateFields.length === 0) {
        const promotion = await executeQuery('SELECT * FROM promotions WHERE id = $1', [id]);
        return promotion[0];
      }
      
      // Add update timestamp
      updateFields.push(`updated_at = NOW()`);
      
      // Add id as the last parameter
      values.push(id);
      
      const query = `
        UPDATE promotions 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCounter}
        RETURNING *
      `;
      
      const result = await executeQuery(query, values);
      return result[0];
    } catch (error) {
      console.error('Error in updatePromotion:', error);
      throw error;
    }
  },

  deletePromotion: async (id: string) => {
    try {
      const query = 'DELETE FROM promotions WHERE id = $1 RETURNING *';
      const result = await executeQuery(query, [id]);
      return result.length > 0;
    } catch (error) {
      console.error('Error in deletePromotion:', error);
      throw error;
    }
  },

  // Products Management
  createProduct: async (productData: any) => {
    try {
      const query = `
        INSERT INTO products (
          title_sr, title_en, price, old_price, image, category,
          is_new, is_on_sale, sku, stock, status,
          description_sr, description_en
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *
      `;
      
      const params = [
        productData.titleSr,
        productData.titleEn,
        productData.price,
        productData.oldPrice || null,
        productData.image,
        productData.category,
        productData.isNew || false,
        productData.isOnSale || false,
        productData.sku,
        productData.stock || 0,
        productData.status || 'active',
        productData.descriptionSr,
        productData.descriptionEn
      ];
      
      const result = await executeQuery(query, params);
      return result[0];
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: any) => {
    try {
      // Build the update query dynamically
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      // Map fields to database columns
      const fieldMapping: Record<string, string> = {
        titleSr: 'title_sr',
        titleEn: 'title_en',
        price: 'price',
        oldPrice: 'old_price',
        image: 'image',
        category: 'category',
        isNew: 'is_new',
        isOnSale: 'is_on_sale',
        sku: 'sku',
        stock: 'stock',
        status: 'status',
        descriptionSr: 'description_sr',
        descriptionEn: 'description_en'
      };
      
      // Add each field that is present in the input data
      for (const [key, dbField] of Object.entries(fieldMapping)) {
        if (key in productData) {
          updateFields.push(`${dbField} = $${paramCounter}`);
          values.push(productData[key]);
          paramCounter++;
        }
      }
      
      // If no fields to update, return the original product
      if (updateFields.length === 0) {
        const product = await executeQuery('SELECT * FROM products WHERE id = $1', [id]);
        return product[0];
      }
      
      // Add update timestamp
      updateFields.push(`updated_at = NOW()`);
      
      // Add id as the last parameter
      values.push(id);
      
      const query = `
        UPDATE products 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCounter}
        RETURNING *
      `;
      
      const result = await executeQuery(query, values);
      return result[0];
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
      const result = await executeQuery(query, [id]);
      return result.length > 0;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  },

  // Customers
  createCustomer: async (customerData: any) => {
    try {
      const query = `
        INSERT INTO customers (
          first_name, last_name, email, phone, default_shipping_address
        ) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *
      `;
      
      const params = [
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.phone,
        customerData.defaultShippingAddress
      ];
      
      const result = await executeQuery(query, params);
      return result[0];
    } catch (error) {
      console.error('Error in createCustomer:', error);
      throw error;
    }
  },

  getCustomers: async () => {
    try {
      const query = 'SELECT * FROM customers ORDER BY created_at DESC';
      return executeQuery(query);
    } catch (error) {
      console.error('Error in getCustomers:', error);
      return [];
    }
  },
  
  getCustomerById: async (id: string) => {
    try {
      const query = 'SELECT * FROM customers WHERE id = $1';
      const result = await executeQuery(query, [id]);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('Error in getCustomerById:', error);
      return null;
    }
  },
  
  updateCustomer: async (id: string, customerData: any) => {
    try {
      // Build the update query dynamically
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      // Map fields to database columns
      const fieldMapping: Record<string, string> = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
        phone: 'phone',
        defaultShippingAddress: 'default_shipping_address'
      };
      
      // Add each field that is present in the input data
      for (const [key, dbField] of Object.entries(fieldMapping)) {
        if (key in customerData) {
          updateFields.push(`${dbField} = $${paramCounter}`);
          values.push(customerData[key]);
          paramCounter++;
        }
      }
      
      // If no fields to update, return the original customer
      if (updateFields.length === 0) {
        const customer = await executeQuery('SELECT * FROM customers WHERE id = $1', [id]);
        return customer[0];
      }
      
      // Add update timestamp
      updateFields.push(`updated_at = NOW()`);
      
      // Add id as the last parameter
      values.push(id);
      
      const query = `
        UPDATE customers 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCounter}
        RETURNING *
      `;
      
      const result = await executeQuery(query, values);
      return result[0];
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      throw error;
    }
  },
  
  deleteCustomer: async (id: string) => {
    try {
      const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
      const result = await executeQuery(query, [id]);
      return result.length > 0;
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      throw error;
    }
  }
};
