
import { executeQuery } from '@/lib/neon';

export const setupDatabase = async (): Promise<boolean> => {
  // Proveriti da li postoje potrebne tabele
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
    
    // Proverimo da li je potrebno kreirati bilo koju tabelu
    const missingTables = requiredTables.filter(
      table => !existingTables.includes(table)
    );
    
    if (missingTables.length === 0) {
      console.log('Sve potrebne tabele postoje');
      return true;
    }
    
    console.log('Nedostajuće tabele:', missingTables);
    return false;
  } catch (error) {
    console.error('Greška prilikom provere tabela:', error);
    return false;
  }
};
