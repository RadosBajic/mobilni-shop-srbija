
import { executeQuery } from '@/lib/neon';

export const setupDatabase = async (): Promise<boolean> => {
  // Proverimo da li je uopšte u serverskom kontekstu
  if (typeof window !== 'undefined') {
    console.log('Running in browser context, skipping real database check');
    return true; // Na klijentu pretpostavljamo da je baza OK
  }

  // Proverimo da li potrebne tabele postoje
  try {
    const requiredTables = ['products', 'orders', 'categories', 'customers', 'banners', 'promotions'];
    
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (${requiredTables.map((_, i) => `$${i + 1}`).join(',')})
    `;
    
    const tables = await executeQuery(query, requiredTables);
    
    // Dobijamo listu postojećih tabela
    const existingTables = tables.map((t: any) => t.table_name);
    
    // Proverimo da li neke tabele nedostaju
    const missingTables = requiredTables.filter(
      table => !existingTables.includes(table)
    );
    
    if (missingTables.length === 0) {
      console.log('All required tables exist');
      return true;
    }
    
    console.log('Missing tables:', missingTables);
    return false;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
};

// Pomoćna funkcija za izvršavanje SQL skripte za inicijalizaciju
export const initializeDatabase = async (): Promise<boolean> => {
  // Proverimo da li je već inicijalizovano
  const isReady = await setupDatabase();
  if (isReady) {
    return true;
  }

  // Ovde bi trebalo da izvršimo SQL za kreiranje tabela
  // U pravom projektu, ovo bi učitalo SQL iz fajla i izvršilo ga
  try {
    const createTablesSQL = `
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
        "order" INTEGER NOT NULL,
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
        "order" INTEGER NOT NULL,
        discount INTEGER,
        start_date TIMESTAMPTZ,
        end_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Izvršavanje SQL-a je podeljeno u više komandi za lakšu obradu grešaka
    const commands = createTablesSQL.split(';')
      .filter(cmd => cmd.trim().length > 0)
      .map(cmd => cmd.trim() + ';');

    for (const cmd of commands) {
      await executeQuery(cmd);
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};
