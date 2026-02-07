import api from '@/lib/axios';

export interface ProductOption {
  id?: string;
  size?: string;
  color?: string;
  material?: string;
  sku?: string;
  stock?: number;
  minStock?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  brandName: string;
  price: number;
  parentCategoryName: string;
  subCategoryName: string;
  categoryId?: string; // Agregado para el DTO
  options: ProductOption[];
  isActive: boolean;
  category?: { id: string; name: string; parent?: { name: string } };
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
    const res = await api.get('/products');
    return res.data.map((p: any) => ({
      ...p,
      parentCategoryName: p.parentCategoryName || p.category?.parent?.name || p.category?.name || 'Sin Categoría',
      subCategoryName: p.subCategoryName || p.category?.name || 'General',
      categoryId: p.categoryId || p.category?.id
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
}

export const productService = new ProductService();