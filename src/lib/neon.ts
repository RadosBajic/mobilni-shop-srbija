
// Configuration for Neon PostgreSQL
const connectionString = "postgresql://neondb_owner:npg_UKgRG1lc7uTn@ep-green-haze-a4nqoybg-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Export connection configuration check function
export const isNeonConfigured = (): boolean => {
  return Boolean(connectionString);
};

// Create a simple API wrapper for database operations
// This avoids importing pg directly in the frontend code
export const executeQuery = async (
  query: string, 
  params?: any[]
): Promise<any> => {
  try {
    // In a production environment, this would call a serverless function or API
    // For demonstration purposes, we'll return mock data for essential queries
    console.log('Query executed:', query, params);
    
    // Mock implementation for frontend
    if (query.includes('SELECT * FROM products')) {
      return mockProducts();
    } else if (query.includes('SELECT * FROM banners')) {
      return mockBanners();
    } else if (query.includes('SELECT * FROM promotions')) {
      return mockPromotions();
    } else if (query.includes('SELECT * FROM orders')) {
      return mockOrders();
    } else if (query.includes('INSERT INTO')) {
      return [{ id: crypto.randomUUID() }];
    } else if (query.includes('UPDATE')) {
      return [{ id: params?.[params.length - 1] }];
    } else if (query.includes('DELETE')) {
      return [];
    }
    
    return [];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Mock data functions
const mockProducts = () => {
  return [
    {
      id: '1',
      title_sr: 'Proizvod 1',
      title_en: 'Product 1',
      price: 1999,
      old_price: 2499,
      image: '/placeholder.svg',
      category: 'electronics',
      is_new: true,
      is_on_sale: true,
      sku: 'PROD-001',
      stock: 10,
      status: 'active',
      description_sr: 'Opis proizvoda 1',
      description_en: 'Product 1 description',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title_sr: 'Proizvod 2',
      title_en: 'Product 2',
      price: 2999,
      old_price: null,
      image: '/placeholder.svg',
      category: 'clothes',
      is_new: false,
      is_on_sale: false,
      sku: 'PROD-002',
      stock: 5,
      status: 'active',
      description_sr: 'Opis proizvoda 2',
      description_en: 'Product 2 description',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};

const mockBanners = () => {
  return [
    {
      id: '1',
      title_sr: 'Baner 1',
      title_en: 'Banner 1',
      description_sr: 'Opis banera 1',
      description_en: 'Banner 1 description',
      image: '/placeholder.svg',
      target_url: '/proizvodi',
      is_active: true,
      position: 'hero',
      order: 1,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

const mockPromotions = () => {
  return [
    {
      id: '1',
      title_sr: 'Promocija 1',
      title_en: 'Promotion 1',
      description_sr: 'Opis promocije 1',
      description_en: 'Promotion 1 description',
      image: '/placeholder.svg',
      target_url: '/proizvodi',
      is_active: true,
      position: 'home',
      order: 1,
      discount: 20,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
};

const mockOrders = () => {
  return [
    {
      id: '1',
      customer_id: null,
      customer_name: 'Marko Marković',
      customer_email: 'marko@example.com',
      customer_phone: '+381601234567',
      shipping_address: {
        street: 'Terazije 23',
        city: 'Beograd',
        postalCode: '11000',
        country: 'Srbija'
      },
      items: [
        {
          productId: '1',
          quantity: 2,
          price: 1999,
          title: 'Proizvod 1'
        }
      ],
      total_amount: 3998,
      status: 'pending',
      payment_method: 'cash_on_delivery',
      payment_status: 'pending',
      notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
