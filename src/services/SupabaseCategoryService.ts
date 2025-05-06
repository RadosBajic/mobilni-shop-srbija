
import { executeQuery } from '@/lib/neon';

// Definicija tipova za bazu
export type SupabaseCategory = {
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
};

// Konvertovanje kategorije iz baze u frontend format
export const mapToCategory = (category: SupabaseCategory) => ({
  id: category.id,
  name: {
    sr: category.name_sr,
    en: category.name_en
  },
  slug: category.slug,
  description: {
    sr: category.description_sr || '',
    en: category.description_en || ''
  },
  image: category.image || '',
  isActive: category.is_active,
  displayOrder: category.display_order,
});

// Konvertovanje CategoryFormData u format za bazu
const mapToSupabaseCategory = (formData: any): Omit<SupabaseCategory, 'created_at' | 'updated_at'> => ({
  id: formData.id || crypto.randomUUID(),
  name_sr: formData.nameSr,
  name_en: formData.nameEn,
  slug: formData.slug || formData.nameSr.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
  description_sr: formData.descriptionSr || null,
  description_en: formData.descriptionEn || null,
  image: formData.image || null,
  is_active: formData.isActive !== undefined ? formData.isActive : true,
  display_order: formData.displayOrder || 0,
});

// Servis za kategorije
export const SupabaseCategoryService = {
  getCategories: async (isActive?: boolean): Promise<any[]> => {
    try {
      let query = 'SELECT * FROM categories';
      const params: any[] = [];
      
      if (isActive !== undefined) {
        query += ' WHERE is_active = $1';
        params.push(isActive);
      }
      
      query += ' ORDER BY display_order ASC';
      
      const data = await executeQuery(query, params);
      return data.map(mapToCategory);
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
    }
  },
  
  getCategoryBySlug: async (slug: string): Promise<any | null> => {
    try {
      const query = 'SELECT * FROM categories WHERE slug = $1';
      const data = await executeQuery(query, [slug]);
      
      if (!data || data.length === 0) return null;
      return mapToCategory(data[0]);
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error);
      throw error;
    }
  },
  
  getCategoryById: async (id: string): Promise<any | null> => {
    try {
      const query = 'SELECT * FROM categories WHERE id = $1';
      const data = await executeQuery(query, [id]);
      
      if (!data || data.length === 0) return null;
      return mapToCategory(data[0]);
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      throw error;
    }
  },
  
  createCategory: async (formData: any): Promise<any> => {
    try {
      const category = mapToSupabaseCategory(formData);
      console.log('Creating category:', category);
      
      // Kreiranje upita sa navedenim kolonama i vrednostima
      const columns = Object.keys(category).join(', ');
      const placeholders = Object.keys(category)
        .map((_, i) => `$${i + 1}`)
        .join(', ');
      
      const query = `
        INSERT INTO categories (${columns}) 
        VALUES (${placeholders})
        RETURNING *
      `;
      
      const values = Object.values(category);
      
      console.log('Executing query:', query);
      console.log('With values:', values);
      
      const data = await executeQuery(query, values);
      
      if (!data || data.length === 0) {
        throw new Error('Failed to create category: No data returned');
      }
      
      console.log('Category created successfully:', data[0]);
      return mapToCategory(data[0]);
    } catch (error) {
      console.error('Error in createCategory:', error);
      throw error;
    }
  },
  
  updateCategory: async (id: string, formData: any): Promise<any> => {
    try {
      const category = mapToSupabaseCategory({ ...formData, id });
      console.log('Updating category:', category);
      
      // Dinamički kreiramo update upit
      const updateFields = Object.keys(category)
        .filter(key => key !== 'id') // Ne ažuriramo ID
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');
      
      const query = `
        UPDATE categories 
        SET ${updateFields}
        WHERE id = $1
        RETURNING *
      `;
      
      const values = [id, ...Object.values(category).filter((_, i) => 
        Object.keys(category)[i] !== 'id'
      )];
      
      const data = await executeQuery(query, values);
      
      if (!data || data.length === 0) {
        throw new Error('Failed to update category: No data returned');
      }
      
      console.log('Category updated successfully:', data[0]);
      return mapToCategory(data[0]);
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      console.log('Deleting category:', id);
      const query = 'DELETE FROM categories WHERE id = $1';
      await executeQuery(query, [id]);
      console.log('Category deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  },
  
  bulkDeleteCategories: async (ids: string[]): Promise<boolean> => {
    try {
      if (!ids.length) return true;
      
      console.log('Bulk deleting categories:', ids);
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      const query = `DELETE FROM categories WHERE id IN (${placeholders})`;
      
      await executeQuery(query, ids);
      console.log('Categories deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in bulkDeleteCategories:', error);
      throw error;
    }
  },
  
  exportCategories: async (): Promise<string> => {
    try {
      const query = 'SELECT * FROM categories';
      const data = await executeQuery(query);
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error in exportCategories:', error);
      throw error;
    }
  }
};
