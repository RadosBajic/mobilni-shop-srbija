
import { executeQuery } from '@/lib/neon';

// Funkcija koja proverava da li je baza podataka inicijalizovana
export const setupDatabase = async (): Promise<boolean> => {
  try {
    // Probamo da dobavimo podatke iz baze
    const result = await executeQuery(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'products'
      ) as exists
    `);
    
    // Ako baza ima products tabelu, možemo reći da je inicijalizovana
    return result.length > 0 && result[0].exists === true;
  } catch (error) {
    console.error('Error checking database setup:', error);
    return false;
  }
};

// Funkcija koja inicijalizuje bazu podataka
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Kreiramo tabele kao što je definisano u supabase_schema.sql
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      )
    `);
    
    // Kreiraj kategorije tabelu
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
      )
    `);
    
    // Dodaj demo podatke za kategorije ako su potrebne
    const existingCategories = await executeQuery(`SELECT COUNT(*) as count FROM categories`);
    if (existingCategories[0].count === '0') {
      // Dodaj demo kategorije
      await executeQuery(`
        INSERT INTO categories (name_sr, name_en, slug, description_sr, description_en, is_active, display_order)
        VALUES 
        ('Maske za telefone', 'Phone Cases', 'phone-cases', 'Kvalitetne maske za telefone', 'Premium phone cases', true, 1),
        ('Zaštita ekrana', 'Screen Protectors', 'screen-protectors', 'Zaštitna stakla i folije', 'Screen protectors and films', true, 2),
        ('Punjači', 'Chargers', 'chargers', 'Punjači za mobilne uređaje', 'Mobile device chargers', true, 3)
      `);
    }
    
    // Kreiraj indekse za bolje performanse
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug)`);
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
