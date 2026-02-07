'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/orderService';
import { OrderDetailModal } from '@/components/modals/OrderDetailModal';
import ManageOrderModal from '@/components/modals/ManageOrderModal';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number | string;
  paymentMethod: string;
  paymentStatus: string;
  user?: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  items: any[];
  shippingAddress?: string;
  trackingNumber?: string;
}

export default function SalesPage() {
  const { isAdmin, isStaff } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
        paymentStatus: order.paymentStatus || 'PAGADO',
        user: order.user ? {
          name: order.user.name,
          email: order.user.email,
          phone: order.user.phone
        } : undefined,
        createdAt: order.createdAt,
        items: order.items || [],
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber
      }));
      
      setOrders(convertedOrders);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      // Datos mock como fallback
      setOrders([
        {
          id: '1',
          orderNumber: 'AB1850E7',
          status: 'ENVIADO',
          total: 389.97,
          paymentMethod: 'TARJETA',
          paymentStatus: 'PAGADO',
          user: {
            name: 'Juan Pérez',
            email: 'juan@example.com',
            phone: '+54 11 1234-5678'
          },
          createdAt: '2026-02-02T18:00:00.000Z',
          items: [],
          shippingAddress: 'Av. Corrientes 1234, Buenos Aires',
          trackingNumber: 'TRK123456789'
        },
        {
          id: '2',
          orderNumber: 'CD2981F4',
          status: 'EN PREPARACIÓN',
          total: 259.99,
          paymentMethod: 'EFECTIVO',
          paymentStatus: 'PAGADO',
          user: {
            name: 'María García',
            email: 'maria@example.com',
            phone: '+54 11 9876-5432'
          },
          createdAt: '2026-02-05T14:30:00.000Z',
          items: [],
          shippingAddress: 'Rivadavia 5678, Buenos Aires',
          trackingNumber: ''
        },
        {
          id: '3',
          orderNumber: 'EF3746G2',
          status: 'CANCELADO',
          total: 129.99,
          paymentMethod: 'TRANSFERENCIA',
          paymentStatus: 'FALLIDO',
          user: {
            name: 'Carlos López',
            email: 'carlos@example.com'
          },
          createdAt: '2026-02-04T10:15:00.000Z',
          items: [],
          shippingAddress: '',
          trackingNumber: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'ENVIADO': 'bg-blue-100 text-blue-800',
      'EN PREPARACIÓN': 'bg-orange-100 text-orange-800',
      'CANCELADO': 'bg-red-100 text-red-800',
      'ENTREGADO': 'bg-green-100 text-green-800',
      'PENDIENTE': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge 
        variant="outline" 
        className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}
      >
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const colors = {
      'PAGADO': 'bg-slate-900 text-white',
      'FALLIDO': 'bg-red-600 text-white',
      'PENDIENTE': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge 
        variant="outline" 
        className={colors[paymentStatus as keyof typeof colors] || 'bg-gray-100 text-gray-800'}
      >
        {paymentStatus}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  };

  const formatPrice = (price: any) => {
    const num = typeof price === 'number' ? price : parseFloat(price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels = {
      'TARJETA': 'Tarjeta',
      'EFECTIVO': 'Efectivo',
      'TRANSFERENCIA': 'Transferencia',
      'MERCADO_PAGO': 'Mercado Pago'
    };
    return labels[method as keyof typeof labels] || method;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
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
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
          <Button 
            className="bg-slate-900 hover:bg-slate-800 text-white"
            onClick={() => setShowManageModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <Card className="bg-white rounded-lg shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-3 p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border-b">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    </div>
                    <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Número de Orden</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-slate-600">
                              {order.user ? getInitials(order.user.name) : 'VD'}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.user?.name || 'Venta directa'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm text-gray-900">
                          {order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          ${formatPrice(order.total)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getPaymentMethodLabel(order.paymentMethod)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => console.log('Editar orden:', order.id)}
                          >
                            <Edit className="h-4 w-4" />
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

        {/* Modal de Detalle */}
        <OrderDetailModal
          open={showDetailModal}
          onOpenChange={setShowDetailModal}
          order={selectedOrder}
        />

        {/* Modal de Gestión */}
        <ManageOrderModal
          open={showManageModal}
          onOpenChange={setShowManageModal}
          order={selectedOrder}
        />
      </div>
    </div>
  );
}
