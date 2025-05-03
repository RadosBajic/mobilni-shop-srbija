
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
    // In real implementation, this would insert into the orders table
    // For now, we'll use the mock implementation in executeQuery
    const query = 'INSERT INTO orders (data) VALUES ($1) RETURNING *';
    return executeQuery(query, [orderData]);
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
  }
};
