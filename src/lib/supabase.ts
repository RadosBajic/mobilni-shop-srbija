
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with the actual project values
const supabaseUrl = "https://autdiptxejoatfoqzyfx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dGRpcHR4ZWpvYXRmb3F6eWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTI1MzQsImV4cCI6MjA2MDIyODUzNH0.q7-dil-0lVwFraLW2L_vwysI3bw3Cib9_3PUS-J3PaI";

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey;
};
