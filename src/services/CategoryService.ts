
import { executeQuery } from '@/lib/neon';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name_sr: string;
  name_en: string;
  slug: string;
  description_sr: string | null;
  description_en: string | null;
  image: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const CategoryService = {
  getCategories: async (isActive?: boolean): Promise<Category[]> => {
    try {
      // Try to get from Supabase first
      try {
        let query = supabase
          .from('categories')
          .select('*');
          
        if (isActive !== undefined) {
          query = query.eq('is_active', isActive);
        }
        
        const { data, error } = await query.order('display_order', { ascending: true });
        
        if (!error && data) {
          return data as Category[];
        }
      } catch (dbError) {
        console.warn('Error fetching categories from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      return executeQuery(
        isActive !== undefined 
          ? 'SELECT * FROM categories WHERE is_active = $1 ORDER BY display_order ASC' 
          : 'SELECT * FROM categories ORDER BY display_order ASC',
        isActive !== undefined ? [isActive] : undefined
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  
  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (!error && data) {
          return data as Category;
        }
      } catch (dbError) {
        console.warn('Error fetching category from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const result = await executeQuery(
        'SELECT * FROM categories WHERE slug = $1', 
        [slug]
      );
      return result.length ? result[0] as Category : null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  },
  
  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single();
          
        if (!error && data) {
          return data as Category;
        }
      } catch (dbError) {
        console.warn('Error fetching category from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const result = await executeQuery(
        'SELECT * FROM categories WHERE id = $1', 
        [id]
      );
      return result.length ? result[0] as Category : null;
    } catch (error) {
      console.error('Error fetching category by id:', error);
      return null;
    }
  },
  
  createCategory: async (data: {
    nameSr: string;
    nameEn: string;
    slug: string;
    descriptionSr?: string;
    descriptionEn?: string;
    image?: string;
    isActive: boolean;
    displayOrder: number;
  }): Promise<Category> => {
    try {
      const { nameSr, nameEn, slug, descriptionSr, descriptionEn, image, isActive, displayOrder } = data;
      
      // Try to insert into Supabase first
      try {
        const { data: newData, error } = await supabase
          .from('categories')
          .insert({
            name_sr: nameSr,
            name_en: nameEn,
            slug,
            description_sr: descriptionSr || null,
            description_en: descriptionEn || null,
            image: image || null,
            is_active: isActive,
            display_order: displayOrder
          })
          .select()
          .single();
          
        if (!error && newData) {
          return newData as Category;
        }
      } catch (dbError) {
        console.warn('Error creating category in Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const result = await executeQuery(
        `INSERT INTO categories 
         (name_sr, name_en, slug, description_sr, description_en, image, is_active, display_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [nameSr, nameEn, slug, descriptionSr || null, descriptionEn || null, image || null, isActive, displayOrder]
      );
      
      return result[0] as Category;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id: string, data: {
    nameSr?: string;
    nameEn?: string;
    slug?: string;
    descriptionSr?: string | null;
    descriptionEn?: string | null;
    image?: string | null;
    isActive?: boolean;
    displayOrder?: number;
  }): Promise<Category> => {
    try {
      const updates: any = {};
      if (data.nameSr !== undefined) updates.name_sr = data.nameSr;
      if (data.nameEn !== undefined) updates.name_en = data.nameEn;
      if (data.slug !== undefined) updates.slug = data.slug;
      if (data.descriptionSr !== undefined) updates.description_sr = data.descriptionSr;
      if (data.descriptionEn !== undefined) updates.description_en = data.descriptionEn;
      if (data.image !== undefined) updates.image = data.image;
      if (data.isActive !== undefined) updates.is_active = data.isActive;
      if (data.displayOrder !== undefined) updates.display_order = data.displayOrder;
      
      // Try to update in Supabase first
      try {
        const { data: updatedData, error } = await supabase
          .from('categories')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (!error && updatedData) {
          return updatedData as Category;
        }
      } catch (dbError) {
        console.warn('Error updating category in Supabase:', dbError);
      }
      
      // Fall back to Neon database
      const keys = Object.keys(updates);
      if (keys.length === 0) {
        // If no updates, just return the current category
        const result = await this.getCategoryById(id);
        if (!result) throw new Error('Category not found');
        return result;
      }
      
      // Build dynamic query for update
      const setClauses = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const query = `
        UPDATE categories 
        SET ${setClauses}, updated_at = NOW()
        WHERE id = $${keys.length + 1}
        RETURNING *
      `;
      
      const result = await executeQuery(query, [...Object.values(updates), id]);
      
      if (!result || result.length === 0) {
        throw new Error('Category not found');
      }
      
      return result[0] as Category;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      // Try to delete from Supabase first
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
          
        if (!error) {
          return true;
        }
      } catch (dbError) {
        console.warn('Error deleting category from Supabase:', dbError);
      }
      
      // Fall back to Neon database
      await executeQuery('DELETE FROM categories WHERE id = $1', [id]);
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
};

export default CategoryService;
