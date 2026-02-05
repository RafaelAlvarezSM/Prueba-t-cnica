'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Package,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para marcas
const mockBrands = [
  { 
    id: 1, 
    name: 'Nike', 
    logo: '/api/placeholder/40/40', 
    productCount: 156, 
    status: 'active',
    foundedYear: 1964,
    country: 'USA'
  },
  { 
    id: 2, 
    name: 'Adidas', 
    logo: '/api/placeholder/40/40', 
    productCount: 142, 
    status: 'active',
    foundedYear: 1949,
    country: 'Germany'
  },
  { 
    id: 3, 
    name: 'Puma', 
    logo: '/api/placeholder/40/40', 
    productCount: 89, 
    status: 'active',
    foundedYear: 1948,
    country: 'Germany'
  },
  { 
    id: 4, 
    name: 'New Balance', 
    logo: '/api/placeholder/40/40', 
    productCount: 67, 
    status: 'active',
    foundedYear: 1906,
    country: 'USA'
  },
  { 
    id: 5, 
    name: 'Reebok', 
    logo: '/api/placeholder/40/40', 
    productCount: 45, 
    status: 'inactive',
    foundedYear: 1958,
    country: 'UK'
  },
  { 
    id: 6, 
    name: 'Under Armour', 
    logo: '/api/placeholder/40/40', 
    productCount: 38, 
    status: 'active',
    foundedYear: 1996,
    country: 'USA'
  },
  { 
    id: 7, 
    name: 'Vans', 
    logo: '/api/placeholder/40/40', 
    productCount: 92, 
    status: 'active',
    foundedYear: 1966,
    country: 'USA'
  },
  { 
    id: 8, 
    name: 'Converse', 
    logo: '/api/placeholder/40/40', 
    productCount: 71, 
    status: 'active',
    foundedYear: 1908,
    country: 'USA'
  }
];

export default function BrandsPage() {
  const { isAdmin } = useAuth();
  const [brands, setBrands] = useState(mockBrands);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    foundedYear: '',
    country: '',
    status: 'active'
  });

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBrand) {
      setBrands(prev => prev.map(brand => 
        brand.id === editingBrand.id 
          ? { ...brand, ...formData, foundedYear: parseInt(formData.foundedYear) }
          : brand
      ));
    } else {
      const newBrand = {
        id: Math.max(...brands.map(b => b.id)) + 1,
        ...formData,
        foundedYear: parseInt(formData.foundedYear),
        logo: '/api/placeholder/40/40',
        productCount: 0
      };
      setBrands(prev => [...prev, newBrand]);
    }

    setFormData({ name: '', foundedYear: '', country: '', status: 'active' });
    setEditingBrand(null);
    setIsModalOpen(false);
  };

  const handleEdit = (brand: any) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      foundedYear: brand.foundedYear.toString(),
      country: brand.country,
      status: brand.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (brandId: number) => {
    setBrands(prev => prev.filter(brand => brand.id !== brandId));
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status === 'active' ? 'Activa' : 'Inactiva'}
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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marcas</h1>
            <p className="text-gray-600">Gestiona las marcas de productos del catálogo</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Marca
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
                </DialogTitle>
                <DialogDescription>
                  {editingBrand 
                    ? 'Modifica los datos de la marca existente.'
                    : 'Agrega una nueva marca al catálogo.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la Marca</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej: Nike"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="foundedYear">Año de Fundación</Label>
                    <Input
                      id="foundedYear"
                      type="number"
                      value={formData.foundedYear}
                      onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
                      placeholder="Ej: 1964"
                      min="1800"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="country">País de Origen</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Ej: USA"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado</Label>
                    <select 
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="active">Activa</option>
                      <option value="inactive">Inactiva</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingBrand ? 'Guardar Cambios' : 'Crear Marca'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Marcas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{brands.length}</div>
              <p className="text-xs text-muted-foreground">
                Marcas registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marcas Activas</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {brands.filter(b => b.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Operativas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {brands.reduce((sum, brand) => sum + brand.productCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Entre todas las marcas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar marcas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brands Table */}
        <Card>
          <CardHeader>
            <CardTitle>Marcas ({filteredBrands.length})</CardTitle>
            <CardDescription>
              Lista completa de marcas y sus productos asociados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Cargando marcas...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Logo</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Fundación</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>{brand.country}</TableCell>
                      <TableCell>{brand.foundedYear}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{brand.productCount} productos</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(brand.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(brand)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(brand.id)}
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
