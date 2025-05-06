
import { handleDbRequest } from "../pages/api/db.ts";

// This is the API endpoint that will be used by the client
export async function handleDatabaseRequest(request: Request): Promise<Response> {
  try {
    const result = await handleDbRequest(request);
    
    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
