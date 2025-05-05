// Ne importujemo Pool direktno, nego samo ako smo na serveru
let Pool: any;

// Omogući učitavanje Pool modula samo na serveru
if (typeof window === 'undefined') {
  // Dynamic import za serversko okruženje
  try {
    const pg = require('pg');
    Pool = pg.Pool;
  } catch (error) {
    console.error('Failed to load pg module:', error);
  }
}

// Konfiguracija za Neon PostgreSQL - bezbedan pristup za process.env
const getConnectionString = () => {
  // Na serverskoj strani, možemo koristiti process.env
  if (typeof window === 'undefined' && typeof process !== 'undefined' && process.env) {
    return process.env.DATABASE_URL || "postgresql://neondb_owner:npg_UKgRG1lc7uTn@ep-green-haze-a4nqoybg-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
  }
  
  // Na klijentskoj strani, vraćamo default string, ali nećemo ga stvarno koristiti
  return "mock_connection_string_for_client";
};

// Instanca pool-a za upravljanje konekcijama
let pool: any;

// Inicijalizacija i konfiguracija pool-a
const getPool = () => {
  if (!pool && Pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
};

// Provera konfiguracije funkcija
export const isNeonConfigured = (): boolean => {
  // Ako smo na klijentu, samo vrati true jer ćemo koristiti serverske endpointe
  if (typeof window !== 'undefined') {
    return true;
  }
  
  // Na serveru, proveravamo stvarnu konfiguraciju
  return Boolean(getConnectionString());
};

// Lokalno skladište za perzistenciju mock podataka između sesija
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
};

// Mock baza podataka koristeći localStorage za klijent
let mockProducts = getLocalStorage('mockProducts', [
  {
    id: '1',
    title_sr: 'iPhone 13 Maska',
    title_en: 'iPhone 13 Case',
    price: 1999,
    old_price: 2499,
    image: '/placeholder.svg',
    category: 'phone-cases',
    is_new: true,
    is_on_sale: true,
    sku: 'CASE-001',
    stock: 10,
    status: 'active',
    description_sr: 'Kvalitetna maska za iPhone 13',
    description_en: 'Premium quality case for iPhone 13',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title_sr: 'Samsung Galaxy S22 Zaštitno staklo',
    title_en: 'Samsung Galaxy S22 Screen Protector',
    price: 1499,
    old_price: null,
    image: '/placeholder.svg',
    category: 'screen-protectors',
    is_new: false,
    is_on_sale: false,
    sku: 'SCRN-002',
    stock: 15,
    status: 'active',
    description_sr: 'Zaštitno staklo za Samsung Galaxy S22',
    description_en: 'Screen protector for Samsung Galaxy S22',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title_sr: 'Univerzalni USB-C punjač',
    title_en: 'Universal USB-C Charger',
    price: 2999,
    old_price: 3499,
    image: '/placeholder.svg',
    category: 'chargers',
    is_new: true,
    is_on_sale: true,
    sku: 'CHRG-001',
    stock: 8,
    status: 'active',
    description_sr: 'Brzi punjač sa USB-C konektorom',
    description_en: 'Fast charger with USB-C connector',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]);

let mockCategories = getLocalStorage('mockCategories', [
  {
    id: '1',
    name_sr: 'Maske za telefone',
    name_en: 'Phone Cases',
    slug: 'phone-cases',
    description_sr: 'Kvalitetne maske za telefone',
    description_en: 'Premium phone cases',
    image: '/placeholder.svg',
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name_sr: 'Zaštita ekrana',
    name_en: 'Screen Protectors',
    slug: 'screen-protectors',
    description_sr: 'Zaštitna stakla i folije',
    description_en: 'Screen protectors and films',
    image: '/placeholder.svg',
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name_sr: 'Punjači',
    name_en: 'Chargers',
    slug: 'chargers',
    description_sr: 'Punjači za mobilne uređaje',
    description_en: 'Mobile device chargers',
    image: '/placeholder.svg',
    is_active: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]);

// Izvršavanje upita - poboljšana verzija
export const executeQuery = async (
  query: string, 
  params?: any[]
): Promise<any> => {
  try {
    // Za serverski kontekst, izvršavaj prave upite direktno kroz Pool
    if (typeof window === 'undefined') {
      const pool = getPool();
      if (!pool) {
        throw new Error('Database pool not initialized');
      }
      const result = await pool.query(query, params);
      return result.rows;
    } 
    
    // Za klijentski (browser) kontekst, šaljemo zahtev serveru
    console.log('Client-side query:', query, params);
    
    // Provera da li je query INSERT, UPDATE ili DELETE
    const isModifyingQuery = 
      query.trim().toUpperCase().startsWith('INSERT') || 
      query.trim().toUpperCase().startsWith('UPDATE') ||
      query.trim().toUpperCase().startsWith('DELETE');
    
    // Za upite koji menjaju podatke, koristimo POST
    if (isModifyingQuery) {
      try {
        // Slanje POST zahteva na server endpoint
        const response = await fetch(createServerEndpoint('db'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            params
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Ažuriramo i lokalne podatke kako bi UI bio ažuran
        updateMockData(query, params, result.data);
        
        return result.data;
      } catch (error) {
        console.error('Error sending request to server:', error);
        console.warn('Falling back to mock data for now...');
        
        // U slučaju greške, radimo sa lokalnim podacima kao rezerva
        return handleQueryLocally(query, params);
      }
    }
    
    // Za SELECT upite, prvo probamo server, pa onda lokalne podatke kao rezervu
    try {
      const response = await fetch(createServerEndpoint('db'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          params
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching data from server:', error);
      console.warn('Falling back to mock data...');
      
      // Ako server nije dostupan, koristimo lokalne podatke
      return handleQueryLocally(query, params);
    }
    
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Funkcija za kreiranje serverske API putanje
const createServerEndpoint = (endpoint: string) => {
  // Base URL za API zahteve
  const apiBase = '/api';
  return `${apiBase}/${endpoint}`;
};

// Funkcija za ažuriranje lokalnih podataka nakon server operacija
const updateMockData = (query: string, params?: any[], result?: any[]) => {
  // INSERT operacije
  if (query.trim().toUpperCase().startsWith('INSERT INTO PRODUCTS')) {
    // Ako imamo rezultate iz servera, koristimo njih
    if (result && result.length > 0) {
      mockProducts.push(result[0]);
      setLocalStorage('mockProducts', mockProducts);
    }
  }
  // UPDATE operacije
  else if (query.trim().toUpperCase().startsWith('UPDATE PRODUCTS')) {
    if (result && result.length > 0) {
      const updatedProduct = result[0];
      const index = mockProducts.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        mockProducts[index] = updatedProduct;
        setLocalStorage('mockProducts', mockProducts);
      }
    }
  }
  // DELETE operacije
  else if (query.trim().toUpperCase().startsWith('DELETE FROM PRODUCTS')) {
    if (params && params.length > 0) {
      const idToDelete = params[0];
      mockProducts = mockProducts.filter(p => p.id !== idToDelete);
      setLocalStorage('mockProducts', mockProducts);
    }
  }
  // Isto za kategorije
  else if (query.trim().toUpperCase().startsWith('INSERT INTO CATEGORIES')) {
    if (result && result.length > 0) {
      mockCategories.push(result[0]);
      setLocalStorage('mockCategories', mockCategories);
    }
  }
  else if (query.trim().toUpperCase().startsWith('UPDATE CATEGORIES')) {
    if (result && result.length > 0) {
      const updatedCategory = result[0];
      const index = mockCategories.findIndex(c => c.id === updatedCategory.id);
      if (index !== -1) {
        mockCategories[index] = updatedCategory;
        setLocalStorage('mockCategories', mockCategories);
      }
    }
  }
  else if (query.trim().toUpperCase().startsWith('DELETE FROM CATEGORIES')) {
    if (params && params.length > 0) {
      const idToDelete = params[0];
      mockCategories = mockCategories.filter(c => c.id !== idToDelete);
      setLocalStorage('mockCategories', mockCategories);
    }
  }
};

// Funkcija za lokalno izvršavanje upita kada server nije dostupan
const handleQueryLocally = (query: string, params?: any[]): any[] => {
  console.log('Handling query locally:', query, params);
  
  // SELECTS za proizvode
  if (query.includes('SELECT * FROM products WHERE status = $1')) {
    let filtered = [...mockProducts].filter(p => p.status === params?.[0]);
    
    // Filter by category if provided
    if (params && params.length > 1 && query.includes('category =')) {
      const categoryIndex = query.includes('category = $2') ? 1 : 
                          query.includes('category = $3') ? 2 : 
                          query.includes('category = $4') ? 3 : 1;
      filtered = filtered.filter(p => p.category === params[categoryIndex]);
    }
    
    // Filter by is_on_sale if provided
    if (params && query.includes('is_on_sale =')) {
      const saleIndex = query.includes('is_on_sale = $2') ? 1 : 
                      query.includes('is_on_sale = $3') ? 2 : 
                      query.includes('is_on_sale = $4') ? 3 : 1;
      filtered = filtered.filter(p => p.is_on_sale === params[saleIndex]);
    }
    
    // Filter by is_new if provided
    if (params && query.includes('is_new =')) {
      const newIndex = query.includes('is_new = $2') ? 1 : 
                     query.includes('is_new = $3') ? 2 : 
                     query.includes('is_new = $4') ? 3 : 
                     query.includes('is_new = $5') ? 4 : 1;
      filtered = filtered.filter(p => p.is_new === params[newIndex]);
    }
    
    // Apply limit if provided
    if (params && query.includes('LIMIT')) {
      const limitIndex = params.length - 1;
      const limit = params[limitIndex];
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }
  // ... keep existing code (other query handlers)
  else if (query.includes('SELECT * FROM products WHERE id = $1')) {
    return mockProducts.filter(p => p.id === params?.[0]);
  }
  else if (query.includes('SELECT * FROM products WHERE id IN')) {
    return mockProducts.filter(p => params?.includes(p.id));
  }
  else if (query.includes('SELECT * FROM products ORDER BY created_at DESC')) {
    return [...mockProducts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  else if (query.includes('SELECT * FROM products')) {
    return mockProducts;
  }
  else if (query.includes('SELECT category FROM products WHERE id = $1')) {
    const product = mockProducts.find(p => p.id === params?.[0]);
    return product ? [{ category: product.category }] : [];
  }
  else if (query.includes('SELECT * FROM categories')) {
    return mockCategories;
  }
  
  // INSERTS
  else if (query.includes('INSERT INTO products')) {
    const newProduct: any = { id: crypto.randomUUID() };
    
    // Parse columns and values from query
    if (params) {
      const columnsMatch = query.match(/INSERT INTO products \(([^)]+)\)/);
      const columns = columnsMatch ? columnsMatch[1].split(', ') : [];
      
      columns.forEach((col, index) => {
        newProduct[col] = params[index];
      });
      
      if (!newProduct.created_at) {
        newProduct.created_at = new Date().toISOString();
      }
      if (!newProduct.updated_at) {
        newProduct.updated_at = new Date().toISOString();
      }
      
      mockProducts.push(newProduct);
      setLocalStorage('mockProducts', mockProducts);
      
      // Log the change in a clear way
      console.log('LOKALNO: Dodat novi proizvod:', newProduct);
      console.log('LOKALNO: Ukupno proizvoda:', mockProducts.length);
    }
    
    return [newProduct];
  }
  
  // UPDATES
  else if (query.includes('UPDATE products SET')) {
    const idIndex = params ? params.findIndex((_, i) => query.includes(`id = $${i + 1}`)) : -1;
    const idParam = idIndex !== -1 ? params?.[idIndex] : params?.[params?.length - 1];
    const productIndex = mockProducts.findIndex(p => p.id === idParam);
    
    if (productIndex !== -1) {
      const updateFields = query.match(/SET ([^W]+)/)?.[1].split(', ');
      
      if (updateFields && params) {
        const updatedProduct = { ...mockProducts[productIndex] };
        
        updateFields.forEach(field => {
          const [column, paramPlaceholder] = field.split(' = ');
          if (paramPlaceholder.startsWith('$')) {
            const paramIndex = parseInt(paramPlaceholder.substring(1)) - 1;
            if (paramIndex >= 0 && paramIndex < params.length) {
              updatedProduct[column] = params[paramIndex];
            }
          }
        });
        
        updatedProduct.updated_at = new Date().toISOString();
        mockProducts[productIndex] = updatedProduct;
        setLocalStorage('mockProducts', mockProducts);
        
        // Log the change
        console.log('LOKALNO: Ažuriran proizvod:', updatedProduct);
      }
      
      return [mockProducts[productIndex]];
    }
    
    return [];
  }
  
  // DELETES
  else if (query.includes('DELETE FROM products WHERE id = $1')) {
    const idToDelete = params?.[0];
    const deletedProduct = mockProducts.find(p => p.id === idToDelete);
    mockProducts = mockProducts.filter(p => p.id !== idToDelete);
    setLocalStorage('mockProducts', mockProducts);
    
    // Log the change
    console.log('LOKALNO: Obrisan proizvod sa ID:', idToDelete);
    return deletedProduct ? [deletedProduct] : [];
  }
  
  // Kategorije i ostali entiteti
  // ... keep existing code (other query handlers for categories and other entities)
  
  // Default empty response
  return [];
};

// Funkcija za resetovanje mock baze u klijentskom okruženju
export const resetMockDatabase = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('mockProducts');
  localStorage.removeItem('mockCategories');
  window.location.reload();
};
