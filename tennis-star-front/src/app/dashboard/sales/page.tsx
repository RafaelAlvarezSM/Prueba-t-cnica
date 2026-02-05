'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter,
  ShoppingCart,
  User,
  CreditCard,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { OrderModal } from '@/components/modals/OrderModal';
import { OrderDetailModal } from '@/components/modals/OrderDetailModal';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  paymentMethod: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  items: any[];
}

export default function SalesPage() {
  const { isAdmin, isStaff } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      
      // Convertir datos al formato esperado
      const convertedOrders = data.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0,
        paymentMethod: order.paymentMethod || 'EFECTIVO',
        user: order.user ? {
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone
        } : undefined,
        createdAt: order.createdAt,
        items: order.items || []
      }));
      
      setOrders(convertedOrders);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      // Datos mock como fallback
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          status: 'ENVIADO',
          total: 259.98,
          paymentMethod: 'TARJETA_CREDITO',
          user: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            phone: '+54 11 1234-5678'
          },
          createdAt: new Date().toISOString(),
          items: []
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          status: 'PENDIENTE',
          total: 129.99,
          paymentMethod: 'TRANSFERENCIA',
          user: {
            name: 'María García',
            email: 'maria@example.com'
          },
          createdAt: new Date().toISOString(),
          items: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'PENDIENTE': 'secondary',
      'ENVIADO': 'default',
      'ENTREGADO': 'default',
      'CANCELADO': 'destructive'
    } as const;

    const colors = {
      'PENDIENTE': 'bg-orange-100 text-orange-800',
      'ENVIADO': 'bg-blue-100 text-blue-800',
      'ENTREGADO': 'bg-green-100 text-green-800',
      'CANCELADO': 'bg-red-100 text-red-800'
    };

    const icons = {
      'PENDIENTE': Clock,
      'ENVIADO': Truck,
      'ENTREGADO': CheckCircle,
      'CANCELADO': XCircle
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge 
        variant={variants[status as keyof typeof variants]} 
        className={colors[status as keyof typeof colors]}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentMethod: string) => {
    // Basar el estado del pago en el método de pago (simplificado)
    const variants = {
      'TARJETA_CREDITO': 'default',
      'TARJETA_DEBITO': 'default',
      'EFECTIVO': 'default',
      'TRANSFERENCIA': 'secondary',
      'MERCADO_PAGO': 'default'
    } as const;

    const colors = {
      'TARJETA_CREDITO': 'bg-green-100 text-green-800',
      'TARJETA_DEBITO': 'bg-green-100 text-green-800',
      'EFECTIVO': 'bg-green-100 text-green-800',
      'TRANSFERENCIA': 'bg-yellow-100 text-yellow-800',
      'MERCADO_PAGO': 'bg-blue-100 text-blue-800'
    };

    const labels = {
      'TARJETA_CREDITO': 'Tarjeta',
      'TARJETA_DEBITO': 'Tarjeta',
      'EFECTIVO': 'Efectivo',
      'TRANSFERENCIA': 'Transferencia',
      'MERCADO_PAGO': 'Mercado Pago'
    };

    return (
      <Badge 
        variant={variants[paymentMethod as keyof typeof variants] || 'secondary'} 
        className={colors[paymentMethod as keyof typeof colors]}
      >
        {labels[paymentMethod as keyof typeof labels] || paymentMethod}
      </Badge>
    );
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDIENTE').length,
    shipped: orders.filter(o => o.status === 'ENVIADO').length,
    delivered: orders.filter(o => o.status === 'ENTREGADO').length,
    cancelled: orders.filter(o => o.status === 'CANCELADO').length,
    totalRevenue: orders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : parseFloat(o.total) || 0), 0)
  };

  // Asegurar que totalRevenue sea siempre un número
  const safeStats = {
    ...stats,
    totalRevenue: typeof stats.totalRevenue === 'number' ? stats.totalRevenue : parseFloat(stats.totalRevenue) || 0
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleOrderCreated = () => {
    // Recargar órdenes después de crear una nueva
    loadOrders();
  };

  // Helper para asegurar que el total sea siempre un número
  const formatPrice = (price: any) => {
    const num = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (!isAdmin && !isStaff) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Acceso Restringido</h2>
          <p className="text-muted-foreground mt-2">Esta página está disponible solo para administradores y staff.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ventas</h1>
            <p className="text-gray-600">Gestiona las órdenes y transacciones</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowOrderModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Generar Venta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{safeStats.total}</div>
              <p className="text-xs text-muted-foreground">
                Todas las órdenes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{safeStats.pending}</div>
              <p className="text-xs text-muted-foreground">
                Esperando procesamiento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviadas</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{safeStats.shipped}</div>
              <p className="text-xs text-muted-foreground">
                En camino
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{safeStats.delivered}</div>
              <p className="text-xs text-muted-foreground">
                Completadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${safeStats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total generado
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
                  placeholder="Buscar órdenes..."
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

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Órdenes ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Listado completo de ventas y transacciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Cargando órdenes...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Número de Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{order.user?.name || 'Venta directa'}</div>
                            <div className="text-sm text-gray-500">{order.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{order.orderNumber}</div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentBadge(order.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ${formatPrice(order.total)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <OrderModal 
          open={showOrderModal} 
          onOpenChange={setShowOrderModal}
          onOrderCreated={handleOrderCreated}
        />

        <OrderDetailModal
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}
