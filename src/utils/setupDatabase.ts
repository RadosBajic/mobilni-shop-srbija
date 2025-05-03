
import { executeQuery } from '@/lib/neon';

export const setupDatabase = async (): Promise<boolean> => {
  // Check if the required tables exist
  try {
    const requiredTables = ['products', 'orders', 'categories', 'customers', 'banners', 'promotions'];
    
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN (${requiredTables.map((_, i) => `$${i + 1}`).join(',')})
    `;
    
    const tables = await executeQuery(query, requiredTables);
    
    // Get the list of existing tables
    const existingTables = tables.map((t: any) => t.table_name);
    
    // Check if any tables are missing
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
