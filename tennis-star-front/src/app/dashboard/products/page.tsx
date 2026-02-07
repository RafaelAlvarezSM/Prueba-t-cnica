'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { productService, Product, CreateProductData, UpdateProductData } from '@/services/productService';
import api from '@/lib/axios';
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
  Filter,
  Package,
  ShoppingCart,
  Eye,
  Loader2
} from 'lucide-react';
import NewProductModal from '@/components/modals/NewProductModal';

export default function ProductsPage() {
  const { isAdmin, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  // Query para obtener productos
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
    retry: 3,
    retryDelay: 1000,
  });

  // Mutación para crear producto
  const createMutation = useMutation({
    mutationFn: (data: CreateProductData) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto creado',
        description: 'El producto se ha creado exitosamente',
      });
      setIsModalOpen(false);
      setEditingProduct(undefined);
    },
    onError: (error: any) => {
      console.error('Error creación:', error);
      const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'No se pudo crear el producto';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Mutación para actualizar producto
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) => 
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto actualizado',
        description: 'El producto se ha actualizado exitosamente',
      });
      setIsModalOpen(false);
      setEditingProduct(undefined);
    },
    onError: (error: any) => {
      console.error('Error actualización:', error);
      const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'No se pudo actualizar el producto';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Mutación para eliminar producto
  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Producto eliminado',
        description: 'El producto se ha eliminado exitosamente',
      });
    },
    onError: (error: any) => {
      console.error('Error eliminación:', error);
      const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'No se pudo eliminar el producto';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Mutación para crear orden (solo para clientes)
  const createOrderMutation = useMutation({
    mutationFn: (orderData: { items: Array<{ productOptionId: string; quantity: number; price: number }>; userId?: string }) => {
      return api.post('/orders', orderData);
    },
    onSuccess: () => {
      toast({
        title: 'Orden creada',
        description: 'Tu orden se ha creado exitosamente',
      });
    },
    onError: (error: any) => {
      console.error('Error orden:', error);
      const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'No se pudo crear la orden';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.parentCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (data: CreateProductData) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleBuy = (productId: string, productOptionId: string, price: number) => {
    createOrderMutation.mutate({
      items: [
        {
          productOptionId,
          quantity: 1,
          price
        }
      ],
      userId: user?.id
    });
  };

  const getStockBadge = (stock: number) => {
    const totalStock = stock;
    if (totalStock >= 15) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          {totalStock} unidades
        </Badge>
      );
    } else if (totalStock >= 5) {
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          {totalStock} unidades
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-red-100 text-red-800">
          {totalStock} unidades
        </Badge>
      );
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      'Hombre': 'bg-blue-100 text-blue-800',
      'Mujer': 'bg-purple-100 text-purple-800',
      'Niño': 'bg-green-100 text-green-800',
      'Niña': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge variant="outline" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category}
      </Badge>
    );
  };

  // Vista para CLIENTES - Grid de Cards
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Grid de Productos */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Imagen del producto */}
                  <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <Package className="h-16 w-16 text-slate-400" />
                  </div>
                  
                  <CardContent className="p-4">
                    {/* Nombre y categoría */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(product.parentCategoryName)}
                        <span className="text-sm text-gray-500">{product.subCategoryName}</span>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Precio y Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          ${product.price.toLocaleString('es-CO')}
                        </p>
                        <p className="text-xs text-gray-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                      {getStockBadge(product.options.reduce((sum, opt) => sum + opt.stock, 0))}
                    </div>

                    {/* Botón de compra */}
                    <Button 
                      onClick={() => {
                        // Usar la primera opción disponible del producto
                        const firstOption = product.options[0];
                        if (firstOption) {
                          handleBuy(product.id, firstOption.id, product.price);
                        }
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                      disabled={createOrderMutation.isPending || product.options.length === 0}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Comprar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Estado vacío */}
          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Vista para ADMIN - Tabla
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <Card className="bg-white rounded-lg shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos por nombre, marca o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Productos */}
        <Card className="bg-white rounded-lg shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border-b">
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
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
                    <TableHead>Nombre</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.brandName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(product.parentCategoryName)}
                          <span className="text-sm text-gray-500">{product.subCategoryName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${product.price.toLocaleString('es-CO')}
                      </TableCell>
                      <TableCell>
                        {getStockBadge(product.options.reduce((sum, opt) => sum + opt.stock, 0))}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          Activo
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
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

        {/* Modal */}
        <NewProductModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          initialData={editingProduct}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </div>
    </div>
  );
}