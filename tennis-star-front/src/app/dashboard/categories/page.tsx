'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Eye,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CategoryModal, { CategoryFormData } from '@/components/modals/CategoryModal';
import { categoryService, Category } from '@/services/categoryService';


export default function CategoriesPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Query para obtener categorías
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
    retry: 3,
    retryDelay: 1000,
  });

  // Mutación para crear categoría
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      const processedData: any = {
        name: data.name,
        position: parseInt(data.position),
        isActive: true
      };
      
      // Agregar parentId solo si no es "none"
      if (data.parentId !== 'none') {
        processedData.parentId = data.parentId;
      }
      
      console.log('Enviando datos al backend:', processedData);
      return categoryService.createCategory(processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoría creada',
        description: 'La categoría se ha creado exitosamente',
      });
      setIsModalOpen(false);
      setEditingCategory(null);
    },
    onError: (error: any) => {
      console.error('Error completo:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      // Extraer mensajes de error específicos
      const responseData = error.response?.data;
      let errorMessage = 'No se pudo crear la categoría';
      
      if (responseData?.message) {
        if (Array.isArray(responseData.message)) {
          // Si es un array de errores, unirlos
          errorMessage = responseData.message.join(', ');
        } else if (typeof responseData.message === 'string') {
          errorMessage = responseData.message;
        }
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Mutación para actualizar categoría
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => {
      const processedData: any = {
        name: data.name,
        position: parseInt(data.position)
      };
      
      // Agregar parentId solo si no es "none"
      if (data.parentId !== 'none') {
        processedData.parentId = data.parentId;
      }
      
      console.log('Actualizando categoría:', id, processedData);
      return categoryService.updateCategory(id, processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoría actualizada',
        description: 'La categoría se ha actualizado exitosamente',
      });
      setIsModalOpen(false);
      setEditingCategory(null);
    },
    onError: (error: any) => {
      console.error('Error actualización:', error);
      console.error('Response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'No se pudo actualizar la categoría';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Mutación para eliminar categoría
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: 'Categoría eliminada',
        description: 'La categoría se ha eliminado exitosamente',
      });
    },
    onError: (error: any) => {
      console.error('Error eliminación:', error);
      console.error('Response data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'No se pudo eliminar la categoría';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      deleteMutation.mutate(categoryId);
    }
  };

  const getParentCategoryBadge = (parentCategory?: string) => {
    if (!parentCategory) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Principal
        </Badge>
      );
    }
    
    const colors = {
      'Hombre': 'bg-blue-100 text-blue-800',
      'Mujer': 'bg-purple-100 text-purple-800',
      'Niño': 'bg-green-100 text-green-800',
      'Niña': 'bg-pink-100 text-pink-800',
      'Running': 'bg-orange-100 text-orange-800',
      'Tenis Casual': 'bg-yellow-100 text-yellow-800',
      'Training': 'bg-teal-100 text-teal-800',
      'Lifestyle': 'bg-indigo-100 text-indigo-800',
      'Escolar': 'bg-gray-100 text-gray-800',
      'Deportivo': 'bg-red-100 text-red-800',
      'Fashion': 'bg-rose-100 text-rose-800'
    };
    
    return (
      <Badge variant="outline" className={colors[parentCategory as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {parentCategory}
      </Badge>
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Acceso Restringido</h2>
          <p className="text-muted-foreground mt-2">Esta página está disponible solo para administradores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        {/* Modal */}
        <CategoryModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          initialData={editingCategory ? {
            name: editingCategory.name,
            parentId: editingCategory.parentId || 'none',
            position: editingCategory.position.toString()
          } : undefined}
          loading={createMutation.isPending || updateMutation.isPending}
        />

        {/* Table */}
        <Card className="bg-white rounded-lg shadow-sm">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border-b">
                    <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error al cargar las categorías</p>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['categories'] })}
                  className="mt-2"
                >
                  Reintentar
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center gap-2">
                        Posición
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Nombre
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Subcategorías</TableHead>
                    <TableHead>Categoría Padre</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.position}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-500" />
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {category.subcategoriesCount} subcategorías
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getParentCategoryBadge(category.parentCategory)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Ver categoría:', category.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
