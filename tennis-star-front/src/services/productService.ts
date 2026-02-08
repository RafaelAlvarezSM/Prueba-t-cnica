import api from '@/lib/axios';

export interface ProductOption {
  id?: string;
  size: string;
  color: string;
  material?: string;
  sku?: string;
  stock: number;
  minStock: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  brandName: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    parent?: {
      id: string;
      name: string;
    } | null;
  };
  options: ProductOption[];
  createdAt: string;
  updatedAt: string;
  // Propiedades computadas para compatibilidad con frontend
  parentCategoryName?: string;
  subCategoryName?: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string;
  brandName: string;
  price: number;
  parentCategoryName: string;
  subCategoryName: string;
  options: ProductOption[];
  isActive?: boolean;
}

// Interfaz que cumple estrictamente con tu UpdateProductDto de NestJS
export interface UpdateProductData {
  name?: string;
  description?: string;
  sku?: string;
  brandName?: string;
  price?: number;
  categoryId?: string;
  isActive?: boolean;
  options?: ProductOption[];
}

class ProductService {
  async getProducts(): Promise<Product[]> {
    const res = await api.get('/products/hierarchy');
    return res.data.map((p: any) => ({
      ...p,
      parentCategoryName: p.category?.parent?.name || '',
      subCategoryName: p.category?.name || ''
    }));
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const res = await api.post('/products', data);
    return res.data;
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    // Eliminamos cualquier campo que no pertenezca al DTO para evitar el 400
    const { parentCategoryName, subCategoryName, ...cleanData }: any = data;
    const res = await api.patch(`/products/${id}`, cleanData);
    return res.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  async getParentCategories(): Promise<string[]> {
    const res = await api.get('/categories/roots');
    return res.data.map((c: any) => c.name);
  }

  async getParentCategoryByName(name: string): Promise<{id: string, name: string} | null> {
    const res = await api.get('/categories/roots');
    const category = res.data.find((c: any) => c.name === name);
    return category || null;
  }

  async getSubcategories(parentId: string): Promise<string[]> {
    const res = await api.get(`/categories/children/${parentId}`);
    return res.data.map((c: any) => c.name);
  }
}

export const productService = new ProductService();