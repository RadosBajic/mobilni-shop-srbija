
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
  },

  // Categories
  getCategories: async (isActive?: boolean) => {
    let query = 'SELECT * FROM categories';
    const params: any[] = [];
    
    if (isActive !== undefined) {
      query += ' WHERE is_active = $1';
      params.push(isActive);
    }
    
    query += ' ORDER BY display_order ASC';
    
    return executeQuery(query, params);
  },

  getCategoryBySlug: async (slug: string) => {
    const query = 'SELECT * FROM categories WHERE slug = $1';
    const result = await executeQuery(query, [slug]);
    return result.length > 0 ? result[0] : null;
  },

  createCategory: async (categoryData: any) => {
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
  },

  // Orders
  createOrder: async (orderData: any) => {
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
    
    return executeQuery(query, params);
  },

  getOrderById: async (id: string) => {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await executeQuery(query, [id]);
    return result.length > 0 ? result[0] : null;
  },

  getOrders: async () => {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    return executeQuery(query);
  },

  updateOrderStatus: async (id: string, status: string) => {
    const query = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
    const result = await executeQuery(query, [status, id]);
    return result.length > 0 ? result[0] : null;
  },

  // Banners
  getBanners: async (position?: string) => {
    let query = 'SELECT * FROM banners';
    const params: any[] = [];
    
    if (position) {
      query += ' WHERE position = $1';
      params.push(position);
    }
    
    query += ' ORDER BY "order" ASC';
    
    return executeQuery(query, params);
  },

  // Promotions
  getPromotions: async (position?: string) => {
    let query = 'SELECT * FROM promotions';
    const params: any[] = [];
    
    if (position) {
      query += ' WHERE position = $1';
      params.push(position);
    }
    
    query += ' ORDER BY "order" ASC';
    
    return executeQuery(query, params);
  },

  // Products Management
  createProduct: async (productData: any) => {
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
  },

  updateProduct: async (id: string, productData: any) => {
    const query = `
      UPDATE products 
      SET title_sr = $1, title_en = $2, price = $3, old_price = $4,
          image = $5, category = $6, is_new = $7, is_on_sale = $8,
          sku = $9, stock = $10, status = $11, description_sr = $12,
          description_en = $13, updated_at = NOW()
      WHERE id = $14
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
      productData.descriptionEn,
      id
    ];
    
    const result = await executeQuery(query, params);
    return result.length > 0 ? result[0] : null;
  },

  deleteProduct: async (id: string) => {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    const result = await executeQuery(query, [id]);
    return result.length > 0;
  },

  // Customers
  createCustomer: async (customerData: any) => {
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
  },

  getCustomers: async () => {
    const query = 'SELECT * FROM customers ORDER BY created_at DESC';
    return executeQuery(query);
  },

  // Banners Management
  createBanner: async (bannerData: any) => {
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
  },

  // Promotions Management
  createPromotion: async (promotionData: any) => {
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
  }
};
