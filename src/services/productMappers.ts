
import { Product, AdminProduct } from '@/types/product';

// Map database product to application Product type
export const mapDbProductToProduct = (dbProduct: any): Product => {
  if (!dbProduct) return {} as Product;
  
  return {
    id: dbProduct.id,
    title: {
      en: dbProduct.title_en || '',
      sr: dbProduct.title_sr || '',
    },
    price: dbProduct.price || 0,
    oldPrice: dbProduct.old_price || null,
    image: dbProduct.image || '',
    category: dbProduct.category || '',
    isNew: dbProduct.is_new || false,
    isOnSale: dbProduct.is_on_sale || false,
  };
};

// Map database product to extended AdminProduct type
export const mapDbProductToAdminProduct = (dbProduct: any): AdminProduct => {
  if (!dbProduct) return {} as AdminProduct;
  
  const product = mapDbProductToProduct(dbProduct);
  
  return {
    ...product,
    sku: dbProduct.sku || '',
    stock: dbProduct.stock || 0,
    status: (dbProduct.status as 'active' | 'outOfStock' | 'draft') || 'draft',
    descriptionSr: dbProduct.description_sr || '',
    descriptionEn: dbProduct.description_en || '',
    description: '', // This field will be set by component based on current language
  };
};

// Map application Product to database schema
export const mapProductToDbProduct = (product: Partial<Product>): any => {
  return {
    title_sr: product.title?.sr || '',
    title_en: product.title?.en || '',
    price: product.price || 0,
    old_price: product.oldPrice || null,
    image: product.image || '',
    category: product.category || '',
    is_new: product.isNew || false,
    is_on_sale: product.isOnSale || false,
  };
};

// Map application AdminProduct to database schema
export const mapAdminProductToDbProduct = (product: Partial<AdminProduct>): any => {
  const baseFields = mapProductToDbProduct(product);
  
  return {
    ...baseFields,
    sku: product.sku || '',
    stock: product.stock || 0,
    status: product.status || 'draft',
    description_sr: product.descriptionSr || '',
    description_en: product.descriptionEn || '',
  };
};
