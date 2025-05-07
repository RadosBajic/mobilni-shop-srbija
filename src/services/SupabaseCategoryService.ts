
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  slug: string;
  name: {
    sr: string;
    en: string;
  };
  description?: {
    sr?: string;
    en?: string;
  };
  image?: string;
  is_active: boolean;
  display_order: number;
}

export const SupabaseCategoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const { data, error } = await supabase.from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data.map(item => ({
        id: item.id,
        slug: item.slug,
        name: {
          sr: item.name_sr || item.name || '',
          en: item.name_en || item.name || '', 
        },
        description: item.description ? {
          sr: item.description_sr || item.description || '',
          en: item.description_en || item.description || '',
        } : undefined,
        image: item.image,
        is_active: item.is_active,
        display_order: item.display_order
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Return mock categories
      return getMockCategories();
    }
  },
  
  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    try {
      const { data, error } = await supabase.from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        slug: data.slug,
        name: {
          sr: data.name_sr || data.name || '',
          en: data.name_en || data.name || '', 
        },
        description: data.description ? {
          sr: data.description_sr || data.description || '',
          en: data.description_en || data.description || '',
        } : undefined,
        image: data.image,
        is_active: data.is_active,
        display_order: data.display_order
      };
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      
      // Return mock category
      const mockCategories = getMockCategories();
      return mockCategories.find(c => c.slug === slug) || null;
    }
  },
  
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    try {
      const categoryData = {
        slug: category.slug,
        name: category.name?.en || '',
        name_sr: category.name?.sr || '',
        name_en: category.name?.en || '',
        description: category.description?.en || null,
        description_sr: category.description?.sr || null,
        description_en: category.description?.en || null,
        image: category.image || null,
        is_active: category.is_active !== undefined ? category.is_active : true,
        display_order: category.display_order || 0,
      };
      
      const { data, error } = await supabase.from('categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        slug: data.slug,
        name: {
          sr: data.name_sr || data.name || '',
          en: data.name_en || data.name || '', 
        },
        description: data.description ? {
          sr: data.description_sr || data.description || '',
          en: data.description_en || data.description || '',
        } : undefined,
        image: data.image,
        is_active: data.is_active,
        display_order: data.display_order
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id: string, category: Partial<Category>): Promise<Category> => {
    try {
      const categoryData = {
        slug: category.slug,
        name: category.name?.en || undefined,
        name_sr: category.name?.sr || undefined,
        name_en: category.name?.en || undefined,
        description: category.description?.en || undefined,
        description_sr: category.description?.sr || undefined,
        description_en: category.description?.en || undefined,
        image: category.image,
        is_active: category.is_active,
        display_order: category.display_order,
      };
      
      // Remove undefined values
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] === undefined) {
          delete categoryData[key];
        }
      });
      
      const { data, error } = await supabase.from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return {
        id: data.id,
        slug: data.slug,
        name: {
          sr: data.name_sr || data.name || '',
          en: data.name_en || data.name || '', 
        },
        description: data.description ? {
          sr: data.description_sr || data.description || '',
          en: data.description_en || data.description || '',
        } : undefined,
        image: data.image,
        is_active: data.is_active,
        display_order: data.display_order
      };
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

// Helper functions for mock data
const getMockCategories = (): Category[] => {
  return [
    {
      id: '1',
      slug: 'phone-cases',
      name: {
        sr: 'Maske za telefon',
        en: 'Phone Cases',
      },
      description: {
        sr: 'Zaštitne maske za različite modele telefona',
        en: 'Protective cases for various phone models',
      },
      image: 'https://picsum.photos/seed/cat1/600/400',
      is_active: true,
      display_order: 1,
    },
    {
      id: '2',
      slug: 'screen-protectors',
      name: {
        sr: 'Zaštitna stakla',
        en: 'Screen Protectors',
      },
      description: {
        sr: 'Zaštitna stakla za ekrane različitih uređaja',
        en: 'Screen protectors for various devices',
      },
      image: 'https://picsum.photos/seed/cat2/600/400',
      is_active: true,
      display_order: 2,
    },
    {
      id: '3',
      slug: 'chargers',
      name: {
        sr: 'Punjači',
        en: 'Chargers',
      },
      description: {
        sr: 'Punjači za mobilne telefone i druge uređaje',
        en: 'Chargers for mobile phones and other devices',
      },
      image: 'https://picsum.photos/seed/cat3/600/400',
      is_active: true,
      display_order: 3,
    },
    {
      id: '4',
      slug: 'accessories',
      name: {
        sr: 'Dodatna oprema',
        en: 'Accessories',
      },
      description: {
        sr: 'Različiti dodaci za mobilne uređaje',
        en: 'Various accessories for mobile devices',
      },
      image: 'https://picsum.photos/seed/cat4/600/400',
      is_active: true,
      display_order: 4,
    },
    {
      id: '5',
      slug: 'audio',
      name: {
        sr: 'Audio oprema',
        en: 'Audio Equipment',
      },
      description: {
        sr: 'Slušalice, zvučnici i druga audio oprema',
        en: 'Headphones, speakers, and other audio equipment',
      },
      image: 'https://picsum.photos/seed/cat5/600/400',
      is_active: true,
      display_order: 5,
    },
  ];
};
