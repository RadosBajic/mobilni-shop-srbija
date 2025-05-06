
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

// Express-style handler function that works with both Express and standard fetch API
export async function handleDbRequest(req: Request): Promise<ApiResponse> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return { 
      success: false, 
      error: 'Method not allowed'
    };
  }

  try {
    // Extract query and params from request body
    const body = await req.json();
    const { query, params } = body;
    
    // Basic validation
    if (!query || typeof query !== 'string') {
      return { 
        success: false, 
        error: 'Invalid query' 
      };
    }
    
    // Security check - block certain types of queries
    const upperQuery = query.toUpperCase();
    const forbiddenKeywords = ['DROP', 'TRUNCATE', 'ALTER', 'GRANT', 'REVOKE'];
    if (forbiddenKeywords.some(keyword => upperQuery.includes(keyword))) {
      return { 
        success: false, 
        error: 'Forbidden operation'
      };
    }
    
    // Execute query
    const result = await pool.query(query, params);
    
    // Return success response
    return {
      success: true,
      data: result.rows
    };
  } catch (error: any) {
    console.error('Database query error:', error);
    
    return {
      success: false,
      error: error.message || 'Internal server error'
    };
  }
}

// This function can be used directly in API routes
export default async function handler(req: Request): Promise<Response> {
  const result = await handleDbRequest(req);
  
  return new Response(
    JSON.stringify(result),
    { 
      status: result.success ? 200 : result.error === 'Method not allowed' ? 405 : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
