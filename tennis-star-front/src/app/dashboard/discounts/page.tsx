'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Percent,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para descuentos
const mockDiscounts = [
  {
    id: 1,
    code: 'VERANO20',
    name: 'Descuento de Verano',
    type: 'PERCENTAGE',
    value: 20,
    minAmount: 100,
    maxDiscount: 50,
    usageLimit: 100,
    usedCount: 45,
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-02-28',
    description: '20% de descuento en compras mayores a $100'
  },
  {
    id: 2,
    code: 'NUEVO10',
    name: 'Bienvenida Nuevo Cliente',
    type: 'PERCENTAGE',
    value: 10,
    minAmount: 50,
    maxDiscount: 25,
    usageLimit: 500,
    usedCount: 234,
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    description: '10% de descuento para nuevos clientes'
  },
  {
    id: 3,
    code: 'ENVIOGRATIS',
    name: 'Envío Gratis',
    type: 'SHIPPING',
    value: 0,
    minAmount: 200,
    maxDiscount: 15,
    usageLimit: 1000,
    usedCount: 567,
    status: 'active',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    description: 'Envío gratis en compras mayores a $200'
  },
  {
    id: 4,
    code: 'BLACKFRIDAY',
    name: 'Black Friday Special',
    type: 'PERCENTAGE',
    value: 30,
    minAmount: 150,
    maxDiscount: 100,
    usageLimit: 200,
    usedCount: 189,
    status: 'expired',
    startDate: '2025-11-29',
    endDate: '2025-11-29',
    description: '30% de descuento en Black Friday'
  },
  {
    id: 5,
    code: 'FIJO50',
    name: 'Descuento Fijo',
    type: 'FIXED',
    value: 50,
    minAmount: 100,
    maxDiscount: 50,
    usageLimit: 50,
    usedCount: 12,
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-02-15',
    description: '$50 de descuento en compras mayores a $100'
  }
];

export default function DiscountsPage() {
  const { isAdmin } = useAuth();
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'PERCENTAGE',
    value: '',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discount.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDiscount) {
      setDiscounts(prev => prev.map(discount => 
        discount.id === editingDiscount.id 
          ? { 
              ...discount, 
              ...formData, 
              value: parseFloat(formData.value),
              minAmount: parseFloat(formData.minAmount),
              maxDiscount: parseFloat(formData.maxDiscount),
              usageLimit: parseInt(formData.usageLimit)
            }
          : discount
      ));
    } else {
      const newDiscount = {
        id: Math.max(...discounts.map(d => d.id)) + 1,
        ...formData,
        value: parseFloat(formData.value),
        minAmount: parseFloat(formData.minAmount),
        maxDiscount: parseFloat(formData.maxDiscount),
        usageLimit: parseInt(formData.usageLimit),
        usedCount: 0
      };
      setDiscounts(prev => [...prev, newDiscount]);
    }

    setFormData({
      code: '',
      name: '',
      type: 'PERCENTAGE',
      value: '',
      minAmount: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      description: '',
      status: 'active'
    });
    setEditingDiscount(null);
    setIsModalOpen(false);
  };

  const handleEdit = (discount: any) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      name: discount.name,
      type: discount.type,
      value: discount.value.toString(),
      minAmount: discount.minAmount.toString(),
      maxDiscount: discount.maxDiscount.toString(),
      usageLimit: discount.usageLimit.toString(),
      startDate: discount.startDate,
      endDate: discount.endDate,
      description: discount.description,
      status: discount.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (discountId: number) => {
    setDiscounts(prev => prev.filter(discount => discount.id !== discountId));
  };

  const getStatusBadge = (status: string, endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    
    if (status === 'expired' || end < now) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Expirado
        </Badge>
      );
    } else if (status === 'active') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Activo
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Inactivo
        </Badge>
      );
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      'PERCENTAGE': { label: '%', color: 'bg-blue-100 text-blue-800' },
      'FIXED': { label: '$', color: 'bg-purple-100 text-purple-800' },
      'SHIPPING': { label: 'Envío', color: 'bg-orange-100 text-orange-800' }
    };
    
    const badge = badges[type as keyof typeof badges] || badges['PERCENTAGE'];
    
    return (
      <Badge variant="outline" className={badge.color}>
        {badge.label}
      </Badge>
    );
  };

  const getUsageProgress = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span>{used} usados</span>
          <span>{limit} límite</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              percentage > 80 ? 'bg-red-500' : 
              percentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Descuentos</h1>
            <p className="text-gray-600">Gestiona cupones y promociones</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Descuento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDiscount ? 'Editar Descuento' : 'Nuevo Descuento'}
                </DialogTitle>
                <DialogDescription>
                  {editingDiscount 
                    ? 'Modifica los datos del descuento existente.'
                    : 'Crea un nuevo cupón o promoción.'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Código</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="Ej: VERANO20"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Descuento de Verano"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">Porcentaje</SelectItem>
                          <SelectItem value="FIXED">Fijo</SelectItem>
                          <SelectItem value="SHIPPING">Envío Gratis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="value">Valor</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder={formData.type === 'PERCENTAGE' ? '20' : '50'}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minAmount">Mínimo</Label>
                      <Input
                        id="minAmount"
                        type="number"
                        value={formData.minAmount}
                        onChange={(e) => setFormData(prev => ({ ...prev, minAmount: e.target.value }))}
                        placeholder="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="maxDiscount">Máximo Descuento</Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                        placeholder="50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="usageLimit">Límite de Uso</Label>
                      <Input
                        id="usageLimit"
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                        placeholder="100"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Fecha Inicio</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">Fecha Fin</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe el descuento..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingDiscount ? 'Guardar Cambios' : 'Crear Descuento'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Descuentos</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discounts.length}</div>
              <p className="text-xs text-muted-foreground">
                Cupones activos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {discounts.filter(d => d.status === 'active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Disponibles ahora
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usos</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {discounts.reduce((sum, d) => sum + d.usedCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Descuentos aplicados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa Uso</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  (discounts.reduce((sum, d) => sum + d.usedCount, 0) / 
                   discounts.reduce((sum, d) => sum + d.usageLimit, 0)) * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                Del límite total
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
                  placeholder="Buscar descuentos..."
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

        {/* Discounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Descuentos ({filteredDiscounts.length})</CardTitle>
            <CardDescription>
              Lista completa de cupones y promociones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Cargando descuentos...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Uso</TableHead>
                    <TableHead>Vigencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-500" />
                          <span className="font-mono font-medium">{discount.code}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{discount.name}</div>
                          <div className="text-sm text-gray-500">{discount.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(discount.type)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {discount.type === 'PERCENTAGE' ? `${discount.value}%` : 
                           discount.type === 'FIXED' ? `$${discount.value}` : 
                           'Gratis'}
                        </div>
                        <div className="text-sm text-gray-500">Mín: ${discount.minAmount}</div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          {getUsageProgress(discount.usedCount, discount.usageLimit)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(discount.startDate).toLocaleDateString('es-ES')}</div>
                          <div className="text-gray-500">
                            {new Date(discount.endDate).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(discount.status, discount.endDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(discount)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(discount.id)}
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
