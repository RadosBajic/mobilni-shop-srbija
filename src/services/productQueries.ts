
import { SupabaseClient } from '@supabase/supabase-js';

// Basic product query builder
export const getBasicProducts = async (
  supabase: SupabaseClient,
  category?: string,
  limit?: number,
  isOnSale?: boolean,
  isNew?: boolean
) => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('status', 'active');
  
  if (category) {
    query = query.eq('category', category);
  }
  
  if (isOnSale) {
    query = query.eq('is_on_sale', true);
  }
  
  if (isNew) {
    query = query.eq('is_new', true);
  }
  
  if (limit) {
    query = query.limit(limit);
  }
  
  return await query;
};

// Featured products query
export const getFeaturedProductsQuery = async (
  supabase: SupabaseClient,
  limit: number = 4
) => {
  return await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('featured', true)
    .limit(limit);
};

// New arrivals query
export const getNewArrivalsQuery = async (
  supabase: SupabaseClient,
  limit: number = 4
) => {
  return await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('is_new', true)
    .limit(limit);
};

// Product by ID query
export const getProductByIdQuery = async (
  supabase: SupabaseClient,
  id: string
) => {
  return await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
};

// Products by IDs query
export const getProductsByIdsQuery = async (
  supabase: SupabaseClient,
  ids: string[]
) => {
  return await supabase
    .from('products')
    .select('*')
    .in('id', ids);
};

// Related products query
export const getRelatedProductsQuery = async (
  supabase: SupabaseClient,
  productId: string,
  limit: number = 4
) => {
  // First get the category of the current product
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('category')
    .eq('id', productId)
    .single();
  
  if (productError || !productData) {
    return { data: [], error: productError };
  }
  
  // Then get related products from the same category
  return await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .eq('category', productData.category)
    .neq('id', productId)
    .limit(limit);
};

// Search products query
export const searchProductsQuery = async (
  supabase: SupabaseClient,
  query: string
) => {
  return await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .or(`title_en.ilike.%${query}%,title_sr.ilike.%${query}%`);
};

// Get all products for admin
export const getAdminProductsQuery = async (
  supabase: SupabaseClient
) => {
  return await supabase
    .from('products')
    .select('*');
};
