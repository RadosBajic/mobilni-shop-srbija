
// Basic product interface used throughout the application
export interface ProductTitle {
  sr: string;
  en: string;
}

export interface Product {
  id: string;
  title: ProductTitle;
  price: number;
  oldPrice: number | null;
  image: string;
  category: string;
  isNew: boolean;
  isOnSale: boolean;
}

// Extended product interface with admin fields
export interface AdminProduct extends Product {
  sku: string;
  stock: number;
  status: 'active' | 'outOfStock' | 'draft';
  descriptionSr: string;
  descriptionEn: string;
  description: string;
}

// Interface for getProducts parameters
export interface GetProductsParams {
  category?: string;
  limit?: number;
  isOnSale?: boolean;
  isNew?: boolean;
}
