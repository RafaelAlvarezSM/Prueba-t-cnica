import api from '@/lib/axios';

export interface Category {
  id: string;
  name: string;
  description?: string;
  position: number;
  isPrincipal: boolean;
  isActive: boolean;
  parentId?: string;
  parentCategory?: string;
  subcategoriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  position?: number;
  parentId?: string;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  position?: number;
  parentId?: string;
  isActive?: boolean;
}

class CategoryService {
  // Obtener todas las categorías con conteo de subcategorías (para tabla)
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return response.data;
  }

  // Obtener una categoría por ID
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  // Crear una nueva categoría
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data;
  }

  // Actualizar una categoría
  async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<Category> {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  }

  // Eliminar una categoría (soft delete)
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  }

  // Obtener categorías raíz (para selector de padre)
  async getParentCategories(): Promise<Category[]> {
    const response = await api.get('/categories/roots');
    return response.data;
  }

  // Obtener subcategorías de una categoría padre
  async getSubcategories(parentId: string): Promise<Category[]> {
    const response = await api.get(`/categories/children/${parentId}`);
    return response.data;
  }
}

export const categoryService = new CategoryService();
