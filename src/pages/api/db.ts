
import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Definišemo tipove za naš API response
type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

// Konfiguracija za PostgreSQL bazu podataka
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_UKgRG1lc7uTn@ep-green-haze-a4nqoybg-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Dozvoljavamo samo POST zahteve
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Izvlačimo query i params iz body-ja
    const { query, params } = req.body;
    
    // Osnovna validacija
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid query' });
    }
    
    // Provera bezbednosti - blokiramo određene tipove upita
    const upperQuery = query.toUpperCase();
    const forbiddenKeywords = ['DROP', 'TRUNCATE', 'ALTER', 'GRANT', 'REVOKE'];
    if (forbiddenKeywords.some(keyword => upperQuery.includes(keyword))) {
      return res.status(403).json({ success: false, error: 'Forbidden operation' });
    }
    
    // Izvršavanje upita
    const result = await pool.query(query, params);
    
    // Vraćamo rezultat
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('Database query error:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
