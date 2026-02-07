import api from '@/lib/axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  brandName: string;
  price: number;
  parentCategoryName: string;
  subCategoryName: string;
  options: ProductOption[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductOption {
  id: string;
  size: string;
  color: string;
  material: string;
  sku: string;
  stock: number;
  minStock: number;
}

export interface CreateProductData {
  name: string;
  description: string;
  sku: string;
  brandName: string;
  price: number;
  parentCategoryName: string;
  subCategoryName: string;
  options: ProductOption[];
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  sku?: string;
  brandName?: string;
  price?: number;
  parentCategoryName?: string;
  subCategoryName?: string;
  options?: ProductOption[];
}

class ProductService {
  // Obtener todos los productos
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  }

  // Obtener un producto por ID
  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  // Crear un nuevo producto
  async createProduct(productData: CreateProductData): Promise<Product> {
    const response = await api.post('/products', productData);
    return response.data;
  }

  // Actualizar un producto
  async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  }

  // Eliminar un producto
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  }

  // Obtener categorías principales para selector
  async getParentCategories(): Promise<string[]> {
    const response = await api.get('/categories/roots');
    return response.data.map((cat: any) => cat.name);
  }

  // Obtener subcategorías de una categoría principal
  async getSubcategories(parentCategoryName: string): Promise<string[]> {
    const response = await api.get(`/categories/children/${parentCategoryName}`);
    return response.data.map((cat: any) => cat.name);
  }
}

export const productService = new ProductService();
