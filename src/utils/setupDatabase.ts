
import { executeQuery } from '@/lib/neon';
import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

export const setupDatabase = async (): Promise<boolean> => {
  try {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      console.log('Running in browser context, skipping real database check');
      return true;
    }

    // Check if required tables exist
    const requiredTables = ['products', 'orders', 'categories', 'customers', 'banners', 'promotions'];
    
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (${requiredTables.map((_, i) => `$${i + 1}`).join(',')})
    `;
    
    const tables = await executeQuery(query, requiredTables);
    const existingTables = tables.map((row: any) => row.table_name);
    
    // Check if all required tables exist
    const allTablesExist = requiredTables.every(table => existingTables.includes(table));
    
    return allTablesExist;
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  }
};

export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      console.log('Running in browser context, skipping database initialization');
      return false;
    }

    try {
      // Read the SQL schema
      const schemaPath = path.resolve(process.cwd(), 'src/db/schema.sql');
      let sqlSchema = '';
      
      try {
        sqlSchema = fs.readFileSync(schemaPath, 'utf8');
      } catch (err) {
        // Use alternative method for environments where file system is not available
        sqlSchema = `
-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_sr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  old_price DECIMAL(10, 2),
  image TEXT,
  category TEXT NOT NULL,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  sku TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  description_sr TEXT,
  description_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_sr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_sr TEXT,
  description_en TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  default_shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners table
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_sr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_sr TEXT,
  description_en TEXT,
  image TEXT,
  target_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_sr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_sr TEXT,
  description_en TEXT,
  image TEXT,
  target_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  discount INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Add triggers to update the updated_at column
CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_categories_timestamp
BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_customers_timestamp
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_banners_timestamp
BEFORE UPDATE ON banners
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_promotions_timestamp
BEFORE UPDATE ON promotions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
`;
      }

      // Execute the SQL schema
      await executeQuery(sqlSchema, []);
      
      // Insert sample data for categories
      const categoriesExist = await executeQuery('SELECT COUNT(*) FROM categories', []);
      if (categoriesExist[0].count === '0') {
        const categoryData = [
          {
            name_sr: 'Maske za telefone',
            name_en: 'Phone Cases',
            slug: 'maske-za-telefone',
            description_sr: 'Sve vrste maski i zaštita za mobilne telefone',
            description_en: 'All types of cases and protection for mobile phones',
            image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop',
            is_active: true,
            display_order: 1
          },
          {
            name_sr: 'Zaštita ekrana',
            name_en: 'Screen Protection',
            slug: 'zastita-ekrana',
            description_sr: 'Zaštitna stakla i folije za sve modele telefona',
            description_en: 'Protective glass and films for all phone models',
            image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=400&auto=format&fit=crop',
            is_active: true,
            display_order: 2
          },
          {
            name_sr: 'Slušalice',
            name_en: 'Headphones',
            slug: 'slusalice',
            description_sr: 'Bežične i žičane slušalice vrhunskog kvaliteta',
            description_en: 'Wireless and wired headphones of premium quality',
            image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=400&auto=format&fit=crop',
            is_active: true,
            display_order: 3
          }
        ];

        for (const category of categoryData) {
          await executeQuery(`
            INSERT INTO categories (name_sr, name_en, slug, description_sr, description_en, image, is_active, display_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            category.name_sr, 
            category.name_en, 
            category.slug, 
            category.description_sr, 
            category.description_en, 
            category.image, 
            category.is_active, 
            category.display_order
          ]);
        }
      }

      // Insert sample data for products if none exist
      const productsExist = await executeQuery('SELECT COUNT(*) FROM products', []);
      if (productsExist[0].count === '0') {
        const productData = [
          {
            title_sr: 'Premium silikonska maska',
            title_en: 'Premium Silicone Case',
            price: 1200,
            old_price: 1500,
            image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop',
            category: 'maske-za-telefone',
            is_new: true,
            is_on_sale: true,
            sku: 'CASE001',
            stock: 50,
            status: 'active',
            description_sr: 'Visokokvalitetna silikonska maska za telefon',
            description_en: 'High-quality silicone phone case'
          },
          {
            title_sr: 'Zaštitno staklo 9D',
            title_en: '9D Protective Glass',
            price: 800,
            old_price: null,
            image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=400&auto=format&fit=crop',
            category: 'zastita-ekrana',
            is_new: true,
            is_on_sale: false,
            sku: 'GLASS001',
            stock: 100,
            status: 'active',
            description_sr: 'Potpuna zaštita ekrana sa 9D staklom',
            description_en: 'Full screen protection with 9D glass'
          }
        ];

        for (const product of productData) {
          await executeQuery(`
            INSERT INTO products (title_sr, title_en, price, old_price, image, category, is_new, is_on_sale, sku, stock, status, description_sr, description_en)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          `, [
            product.title_sr,
            product.title_en,
            product.price,
            product.old_price,
            product.image,
            product.category,
            product.is_new,
            product.is_on_sale,
            product.sku,
            product.stock,
            product.status,
            product.description_sr,
            product.description_en
          ]);
        }
      }

      // Insert sample banner data if none exist
      const bannersExist = await executeQuery('SELECT COUNT(*) FROM banners', []);
      if (bannersExist[0].count === '0') {
        const bannerData = [
          {
            title_sr: 'Nove kolekcije',
            title_en: 'New Collections',
            description_sr: 'Pogledajte naše nove proizvode',
            description_en: 'Check out our new products',
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1080&auto=format&fit=crop',
            target_url: '/proizvodi?new=true',
            is_active: true,
            position: 'hero',
            order: 1
          },
          {
            title_sr: 'Specijalna ponuda',
            title_en: 'Special Offer',
            description_sr: 'Popusti do 30% na odabrane artikle',
            description_en: 'Up to 30% off on selected items',
            image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1080&auto=format&fit=crop',
            target_url: '/proizvodi?sale=true',
            is_active: true,
            position: 'promo',
            order: 1
          }
        ];

        for (const banner of bannerData) {
          await executeQuery(`
            INSERT INTO banners (title_sr, title_en, description_sr, description_en, image, target_url, is_active, position, "order")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `, [
            banner.title_sr,
            banner.title_en,
            banner.description_sr,
            banner.description_en,
            banner.image,
            banner.target_url,
            banner.is_active,
            banner.position,
            banner.order
          ]);
        }
      }

      // Insert sample promotion data if none exist
      const promotionsExist = await executeQuery('SELECT COUNT(*) FROM promotions', []);
      if (promotionsExist[0].count === '0') {
        const promotionData = [
          {
            title_sr: 'Premium slušalice',
            title_en: 'Premium Headphones',
            description_sr: 'Kvalitet zvuka koji zaslužujete',
            description_en: 'The sound quality you deserve',
            image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?q=80&w=400&auto=format&fit=crop',
            target_url: '/kategorija/slusalice',
            is_active: true,
            position: 'home',
            order: 1,
            discount: 15
          },
          {
            title_sr: 'Zaštita za vaš telefon',
            title_en: 'Protection for your phone',
            description_sr: 'Najbolji izbor maski i zaštitnih stakala',
            description_en: 'Best selection of cases and protective glasses',
            image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop',
            target_url: '/kategorija/maske-za-telefone',
            is_active: true,
            position: 'home',
            order: 2,
            discount: 20
          }
        ];

        for (const promo of promotionData) {
          await executeQuery(`
            INSERT INTO promotions (title_sr, title_en, description_sr, description_en, image, target_url, is_active, position, "order", discount)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          `, [
            promo.title_sr,
            promo.title_en,
            promo.description_sr,
            promo.description_en,
            promo.image,
            promo.target_url,
            promo.is_active,
            promo.position,
            promo.order,
            promo.discount
          ]);
        }
      }

      return true;
    } catch (error) {
      console.error('Error initializing database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in database initialization:', error);
    return false;
  }
};
