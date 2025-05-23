
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

// Funkcija za kreiranje serverske API putanje
const createServerEndpoint = (endpoint: string) => {
  // Base URL za API zahteve - updated to use the new endpoint
  const apiBase = '/api';
  return `${apiBase}/${endpoint}`;
};

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
        // Slanje POST zahteva na server endpoint - using the updated endpoint
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

  // SELECTS za kategorije
  else if (query.includes('SELECT * FROM categories WHERE slug = $1')) {
    return mockCategories.filter(c => c.slug === params?.[0]);
  }
  else if (query.includes('SELECT * FROM categories WHERE id = $1')) {
    return mockCategories.filter(c => c.id === params?.[0]);
  }
  else if (query.includes('SELECT * FROM categories WHERE is_active =')) {
    return mockCategories.filter(c => c.is_active === params?.[0]);
  }
  else if (query.includes('SELECT * FROM categories ORDER BY display_order')) {
    return [...mockCategories].sort((a, b) => a.display_order - b.display_order);
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
  else if (query.includes('INSERT INTO categories')) {
    const newCategory: any = { id: crypto.randomUUID() };
    
    // Parse columns and values from query
    if (params) {
      const columnsMatch = query.match(/INSERT INTO categories \(([^)]+)\)/);
      const columns = columnsMatch ? columnsMatch[1].split(', ') : [];
      
      columns.forEach((col, index) => {
        newCategory[col] = params[index];
      });
      
      if (!newCategory.created_at) {
        newCategory.created_at = new Date().toISOString();
      }
      if (!newCategory.updated_at) {
        newCategory.updated_at = new Date().toISOString();
      }
      
      mockCategories.push(newCategory);
      setLocalStorage('mockCategories', mockCategories);
      
      // Log the change in a clear way
      console.log('LOKALNO: Dodata nova kategorija:', newCategory);
      console.log('LOKALNO: Ukupno kategorija:', mockCategories.length);
    }
    
    return [newCategory];
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
  else if (query.includes('UPDATE categories SET')) {
    const idIndex = params ? params.findIndex((_, i) => query.includes(`id = $${i + 1}`)) : -1;
    const idParam = idIndex !== -1 ? params?.[idIndex] : params?.[params?.length - 1];
    const categoryIndex = mockCategories.findIndex(c => c.id === idParam);
    
    if (categoryIndex !== -1) {
      const updateFields = query.match(/SET ([^W]+)/)?.[1].split(', ');
      
      if (updateFields && params) {
        const updatedCategory = { ...mockCategories[categoryIndex] };
        
        updateFields.forEach(field => {
          const [column, paramPlaceholder] = field.split(' = ');
          if (paramPlaceholder.startsWith('$')) {
            const paramIndex = parseInt(paramPlaceholder.substring(1)) - 1;
            if (paramIndex >= 0 && paramIndex < params.length) {
              updatedCategory[column] = params[paramIndex];
            }
          }
        });
        
        updatedCategory.updated_at = new Date().toISOString();
        mockCategories[categoryIndex] = updatedCategory;
        setLocalStorage('mockCategories', mockCategories);
        
        // Log the change
        console.log('LOKALNO: Ažurirana kategorija:', updatedCategory);
      }
      
      return [mockCategories[categoryIndex]];
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
  else if (query.includes('DELETE FROM categories WHERE id = $1')) {
    const idToDelete = params?.[0];
    const deletedCategory = mockCategories.find(c => c.id === idToDelete);
    mockCategories = mockCategories.filter(c => c.id !== idToDelete);
    setLocalStorage('mockCategories', mockCategories);
    
    // Log the change
    console.log('LOKALNO: Obrisana kategorija sa ID:', idToDelete);
    return deletedCategory ? [deletedCategory] : [];
  }
  
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

// Novi API za kategorije koji će biti korišćen u komponenti
export const categoryApi = {
  getCategories: async (isActive?: boolean) => {
    return executeQuery(
      isActive !== undefined 
        ? 'SELECT * FROM categories WHERE is_active = $1 ORDER BY display_order ASC' 
        : 'SELECT * FROM categories ORDER BY display_order ASC',
      isActive !== undefined ? [isActive] : undefined
    );
  },
  
  getCategoryBySlug: async (slug: string) => {
    const result = await executeQuery(
      'SELECT * FROM categories WHERE slug = $1', 
      [slug]
    );
    return result.length ? result[0] : null;
  },
  
  createCategory: async (data: any) => {
    const { nameSr, nameEn, slug, descriptionSr, descriptionEn, image, isActive, displayOrder } = data;
    
    const generatedSlug = slug || nameSr.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
    
    return executeQuery(
      `INSERT INTO categories (name_sr, name_en, slug, description_sr, description_en, image, is_active, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [nameSr, nameEn, generatedSlug, descriptionSr || null, descriptionEn || null, image || null, isActive, displayOrder || 0]
    );
  },
  
  updateCategory: async (id: string, data: any) => {
    const { nameSr, nameEn, slug, descriptionSr, descriptionEn, image, isActive, displayOrder } = data;
    
    return executeQuery(
      `UPDATE categories 
      SET name_sr = $1, name_en = $2, slug = $3, description_sr = $4, description_en = $5, 
          image = $6, is_active = $7, display_order = $8, updated_at = NOW()
      WHERE id = $9
      RETURNING *`,
      [nameSr, nameEn, slug, descriptionSr || null, descriptionEn || null, image || null, isActive, displayOrder, id]
    );
  },
  
  deleteCategory: async (id: string) => {
    return executeQuery('DELETE FROM categories WHERE id = $1', [id]);
  }
};

// Novi API za proizvode koji će biti korišćen u komponenti
export const productApi = {
  getProducts: async (options: { category?: string, status?: string, isOnSale?: boolean, isNew?: boolean, limit?: number }) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (options.status) {
      query += ` AND status = $${paramIndex}`;
      params.push(options.status);
      paramIndex++;
    }
    
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
  
  getProductById: async (id: string) => {
    const result = await executeQuery(
      'SELECT * FROM products WHERE id = $1', 
      [id]
    );
    return result.length ? result[0] : null;
  },
  
  createProduct: async (data: any) => {
    const columns = [
      'title_sr', 'title_en', 'price', 'old_price', 'image', 'category',
      'is_new', 'is_on_sale', 'sku', 'stock', 'status', 'description_sr', 'description_en'
    ];
    
    const values = [
      data.nameSr, 
      data.nameEn, 
      data.price, 
      data.oldPrice || null, 
      data.image || '', 
      data.category,
      data.isNew || false, 
      data.isOnSale || false, 
      data.sku, 
      data.stock || 0, 
      data.status || 'active',
      data.descriptionSr || null, 
      data.descriptionEn || null
    ];
    
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    return executeQuery(
      `INSERT INTO products (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *`,
      values
    );
  },
  
  updateProduct: async (id: string, data: any) => {
    return executeQuery(
      `UPDATE products 
      SET title_sr = $1, title_en = $2, price = $3, old_price = $4, image = $5, category = $6, 
          is_new = $7, is_on_sale = $8, sku = $9, stock = $10, status = $11, 
          description_sr = $12, description_en = $13, updated_at = NOW()
      WHERE id = $14
      RETURNING *`,
      [
        data.nameSr, 
        data.nameEn, 
        data.price, 
        data.oldPrice || null, 
        data.image || '', 
        data.category,
        data.isNew || false, 
        data.isOnSale || false, 
        data.sku, 
        data.stock || 0, 
        data.status || 'active',
        data.descriptionSr || null, 
        data.descriptionEn || null,
        id
      ]
    );
  },
  
  deleteProduct: async (id: string) => {
    return executeQuery('DELETE FROM products WHERE id = $1', [id]);
  }
};
