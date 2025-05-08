
import { v4 as uuidv4 } from 'uuid';

export interface Category {
  id: string;
  slug: string;
  name: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  image?: string;
  parent_id?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Helper functions for localStorage
const getCategories = (): Category[] => {
  const stored = localStorage.getItem('categories');
  return stored ? JSON.parse(stored) : [];
};

const saveCategories = (categories: Category[]): void => {
  localStorage.setItem('categories', JSON.stringify(categories));
};

// Initialize with default data
const initializeCategories = (): void => {
  if (getCategories().length === 0) {
    const defaultCategories: Category[] = [
      {
        id: uuidv4(),
        slug: 'phone-cases',
        name: { sr: 'Maske za telefone', en: 'Phone Cases' },
        description: { 
          sr: 'Zaštitne maske za različite modele telefona',
          en: 'Protective cases for various phone models'
        },
        image: '/assets/categories/cases.jpg',
        parent_id: null,
        is_active: true,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        slug: 'screen-protectors',
        name: { sr: 'Zaštita ekrana', en: 'Screen Protectors' },
        description: {
          sr: 'Zaštitna stakla i folije za ekrane',
          en: 'Screen protectors and films'
        },
        image: '/assets/categories/protectors.jpg',
        parent_id: null,
        is_active: true,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: uuidv4(),
        slug: 'chargers',
        name: { sr: 'Punjači', en: 'Chargers' },
        description: {
          sr: 'Punjači za mobilne uređaje',
          en: 'Chargers for mobile devices'
        },
        image: '/assets/categories/chargers.jpg',
        parent_id: null,
        is_active: true,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    saveCategories(defaultCategories);
  }
};

// Call initialization
initializeCategories();

export const CategoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    return getCategories();
  },
  
  // Get category by ID
  getCategoryById: async (id: string): Promise<Category | null> => {
    const categories = getCategories();
    return categories.find(category => category.id === id) || null;
  },
  
  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    const categories = getCategories();
    return categories.find(category => category.slug === slug) || null;
  },
  
  // Create a new category
  createCategory: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    const newCategory: Category = {
      id: uuidv4(),
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const categories = getCategories();
    categories.push(newCategory);
    saveCategories(categories);
    
    return newCategory;
  },
  
  // Update an existing category
  updateCategory: async (id: string, updates: Partial<Category>): Promise<Category> => {
    const categories = getCategories();
    const index = categories.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const category = categories[index];
    
    // Type safety: ensure we're not removing required properties
    const updatedCategory: Category = {
      ...category,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    categories[index] = updatedCategory;
    saveCategories(categories);
    
    return updatedCategory;
  },
  
  // Delete a category
  deleteCategory: async (id: string): Promise<void> => {
    const categories = getCategories();
    const filtered = categories.filter(c => c.id !== id);
    
    // If we have deleted a category, also update any children to have null parent
    const updated = filtered.map(c => {
      if (c.parent_id === id) {
        return { ...c, parent_id: null, updated_at: new Date().toISOString() };
      }
      return c;
    });
    
    saveCategories(updated);
  },

  // Get child categories
  getChildCategories: async (parentId: string): Promise<Category[]> => {
    const categories = getCategories();
    return categories.filter(c => c.parent_id === parentId);
  }
};
