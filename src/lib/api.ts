
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
    const query = 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2';
    return executeQuery(query, [status, id]);
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
  }
};
