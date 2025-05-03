
import { Pool } from 'pg';

// Konfiguracija za Neon PostgreSQL
const connectionString = "postgresql://neondb_owner:npg_UKgRG1lc7uTn@ep-green-haze-a4nqoybg-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Kreiraj pool za povezivanje
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Potrebno za Neon SSL konekciju
  }
});

// Izvezi funkciju za proveru konfiguracije
export const isNeonConfigured = (): boolean => {
  return Boolean(connectionString);
};

// Pomoćna funkcija za izvršavanje upita
export const executeQuery = async (
  query: string, 
  params?: any[]
): Promise<any> => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return result.rows;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
