
import { executeQuery } from '@/lib/neon';

// Definicija tipova
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

export type Category = {
  id: string;
  name: {
    sr: string;
    en: string;
  };
  slug: string;
  description: {
    sr: string;
    en: string;
  };
  image: string;
  isActive: boolean;
  displayOrder: number;
};

// Helpers za konverziju
const mapToCategory = (category: SupabaseCategory): Category => ({
  id: category.id,
  name: {
    sr: category.name_sr,
    en: category.name_en
  },
  slug: category.slug,
  description: {
    sr: category.description_sr || "",
    en: category.description_en || ""
  },
  image: category.image || "",
  isActive: category.is_active,
  displayOrder: category.display_order
});

export const SupabaseCategoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const query = 'SELECT * FROM categories ORDER BY display_order ASC';
      const data = await executeQuery(query);
      return data.map(mapToCategory);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },
  
  createCategory: async (categoryData: any): Promise<Category> => {
    try {
      const id = crypto.randomUUID();
      
      const query = `
        INSERT INTO categories (
          id, name_sr, name_en, slug, description_sr, description_en, image, is_active, display_order
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        ) RETURNING *
      `;
      
      const values = [
        id,
        categoryData.name.sr,
        categoryData.name.en,
        categoryData.slug,
        categoryData.description?.sr || null,
        categoryData.description?.en || null,
        categoryData.image || null,
        categoryData.isActive,
        categoryData.displayOrder || 0
      ];
      
      const result = await executeQuery(query, values);
      return mapToCategory(result[0]);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id: string, categoryData: any): Promise<Category> => {
    try {
      const query = `
        UPDATE categories SET
          name_sr = $1,
          name_en = $2,
          slug = $3,
          description_sr = $4,
          description_en = $5,
          image = $6,
          is_active = $7,
          display_order = $8,
          updated_at = NOW()
        WHERE id = $9
        RETURNING *
      `;
      
      const values = [
        categoryData.name.sr,
        categoryData.name.en,
        categoryData.slug,
        categoryData.description?.sr || null,
        categoryData.description?.en || null,
        categoryData.image || null,
        categoryData.isActive,
        categoryData.displayOrder || 0,
        id
      ];
      
      const result = await executeQuery(query, values);
      return mapToCategory(result[0]);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      const query = 'DELETE FROM categories WHERE id = $1';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const query = 'SELECT * FROM categories WHERE slug = $1';
      const data = await executeQuery(query, [slug]);
      
      if (!data || data.length === 0) return null;
      return mapToCategory(data[0]);
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  },

  getActiveCategories: async (): Promise<Category[]> => {
    try {
      const query = 'SELECT * FROM categories WHERE is_active = true ORDER BY display_order ASC';
      const data = await executeQuery(query);
      return data.map(mapToCategory);
    } catch (error) {
      console.error('Error fetching active categories:', error);
      throw error;
    }
  }
};
