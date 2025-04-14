
import { supabase } from '@/lib/supabase';

export const setupDatabase = async (): Promise<boolean> => {
  // Check if required tables exist
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .in('table_name', ['products', 'orders', 'categories', 'customers']);
  
  if (error) {
    console.error('Error checking tables:', error);
    return false;
  }
  
  // Get list of existing tables
  const existingTables = tables.map(t => t.table_name);
  
  // Check if we need to create any tables
  const missingTables = ['products', 'orders', 'categories', 'customers'].filter(
    table => !existingTables.includes(table)
  );
  
  if (missingTables.length === 0) {
    console.log('All required tables exist');
    return true;
  }
  
  console.log('Missing tables:', missingTables);
  return false;
};
