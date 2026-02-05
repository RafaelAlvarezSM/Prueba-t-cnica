'use client';

import { useState, useEffect } from 'react';
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
import CategoryModal, { CategoryFormData } from '@/components/modals/CategoryModal';

// Mock data para categorías
const mockCategories = [
  {
    id: 1,
    name: 'Hombre',
    position: 1,
    subcategories: 15,
    parentCategory: null,
    status: 'active'
  },
  {
    id: 2,
    name: 'Mujer',
    position: 2,
    subcategories: 12,
    parentCategory: null,
    status: 'active'
  },
  {
    id: 3,
    name: 'Niño',
    position: 3,
    subcategories: 8,
    parentCategory: null,
    status: 'active'
  },
  {
    id: 4,
    name: 'Niña',
    position: 4,
    subcategories: 6,
    parentCategory: null,
    status: 'active'
  },
  {
    id: 5,
    name: 'Running',
    position: 5,
    subcategories: 4,
    parentCategory: 'Hombre',
    status: 'active'
  },
  {
    id: 6,
    name: 'Tenis Casual',
    position: 6,
    subcategories: 5,
    parentCategory: 'Hombre',
    status: 'active'
  },
  {
    id: 7,
    name: 'Training',
    position: 7,
    subcategories: 7,
    parentCategory: 'Mujer',
    status: 'active'
  },
  {
    id: 8,
    name: 'Lifestyle',
    position: 8,
    subcategories: 4,
    parentCategory: 'Mujer',
    status: 'active'
  },
  {
    id: 9,
    name: 'Escolar',
    position: 9,
    subcategories: 6,
    parentCategory: 'Niño',
    status: 'active'
  },
  {
    id: 10,
    name: 'Deportivo',
    position: 10,
    subcategories: 5,
    parentCategory: 'Niño',
    status: 'active'
  },
  {
    id: 11,
    name: 'Escolar',
    position: 11,
    subcategories: 4,
    parentCategory: 'Niña',
    status: 'active'
  },
  {
    id: 12,
    name: 'Fashion',
    position: 12,
    subcategories: 3,
    parentCategory: 'Niña',
    status: 'active'
  }
];

export default function CategoriesPage() {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: CategoryFormData) => {
    // Convertir 'none' a string vacío para el backend
    const processedData = {
      ...data,
      parentCategory: data.parentCategory === 'none' ? '' : data.parentCategory
    };

    if (editingCategory) {
      setCategories(prev => prev.map(category => 
        category.id === editingCategory.id 
          ? { ...category, ...processedData, position: parseInt(processedData.position) }
          : category
      ));
    } else {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        ...processedData,
        position: parseInt(processedData.position),
        subcategories: 0,
        status: 'active'
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId: number) => {
    setCategories(prev => prev.filter(category => category.id !== categoryId));
  };

  const getParentCategoryBadge = (parentCategory: string | null) => {
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
            parentCategory: editingCategory.parentCategory || 'none',
            position: editingCategory.position.toString()
          } : undefined}
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
            {loading ? (
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
                          {category.subcategories} subcategorías
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
