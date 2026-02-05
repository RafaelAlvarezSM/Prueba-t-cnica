'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  TrendingUp,
  BarChart3,
  Eye,
  Activity,
  Target
} from 'lucide-react';
import { orderService } from '@/services/orderService';

// Datos mock para fallback
const mockStats = {
  totalSales: 125430,
  salesGrowth: 12.5,
  totalOrders: 3420,
  ordersGrowth: 8.2,
  totalProducts: 485,
  productsGrowth: 5.7,
  totalCustomers: 8920,
  customersGrowth: 15.3,
  recentOrders: [
    { id: 'ORD-3421', customer: 'Juan Pérez', total: 129.99, status: 'PENDIENTE', time: 'Hace 2 minutos' },
    { id: 'ORD-3420', customer: 'María García', total: 89.99, status: 'ENVIADO', time: 'Hace 5 minutos' },
    { id: 'ORD-3419', customer: 'Carlos López', total: 156.50, status: 'ENTREGADO', time: 'Hace 8 minutos' },
    { id: 'ORD-3418', customer: 'Ana Martínez', total: 234.75, status: 'PENDIENTE', time: 'Hace 15 minutos' },
    { id: 'ORD-3417', customer: 'Roberto Díaz', total: 78.25, status: 'ENVIADO', time: 'Hace 22 minutos' }
  ]
};

export default function DashboardPage() {
  const { user, isAdmin, isStaff, isCliente } = useAuth();
  const [realStats, setRealStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos reales si es ADMIN o STAFF
  useEffect(() => {
    if ((isAdmin || isStaff) && !loading) {
      loadRealData();
    }
  }, [isAdmin, isStaff]);

  const loadRealData = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getOrders();
      
      // Calcular estadísticas reales
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const recentOrders = orders.slice(-5).reverse().map(order => ({
        id: order.orderNumber,
        customer: order.user?.name || 'Venta directa',
        total: order.total,
        status: order.status,
        time: 'Hace unos minutos'
      }));

      setRealStats({
        totalOrders,
        totalSales,
        recentOrders
      });
    } catch (error) {
      console.log('Usando datos mock - Error cargando datos reales:', error);
      // Mantener datos mock si hay error
    } finally {
      setLoading(false);
    }
  };

  // Usar datos reales si existen, si no usar mock
  const stats = realStats || mockStats;

  // Redirección basada en rol
  useEffect(() => {
    if (isCliente) {
      window.location.href = '/dashboard/catalog';
    }
  }, [isCliente]);

  if (isCliente) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Redirigiendo...</h2>
          <p className="text-muted-foreground mt-2">Los clientes son redirigidos al catálogo.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Bienvenido, {user?.name || 'Usuario'}!
        </h1>
        <p className="text-muted-foreground">
          {isAdmin ? 'Panel de Administración - Vista completa del sistema' : 
           isStaff ? 'Panel de Ventas - Gestión de órdenes y productos' :
           'Panel de Control'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockStats.salesGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockStats.ordersGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockStats.productsGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockStats.customersGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions para ADMIN */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Acciones administrativas más comunes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col">
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span>Nueva Venta</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Package className="h-6 w-6 mb-2" />
                <span>Agregar Producto</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Nuevo Cliente</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="h-6 w-6 mb-2" />
                <span>Ver Estadísticas</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Órdenes Recientes
            </span>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Todas
            </Button>
          </CardTitle>
          <CardDescription>
            Últimas {isAdmin ? 'transacciones' : 'ventas'} registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant={order.status === 'ENTREGADO' ? 'default' : 
                               order.status === 'ENVIADO' ? 'secondary' : 'destructive'}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="font-semibold">${order.total}</p>
                  <p className="text-xs text-muted-foreground">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Source Indicator */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">
                Fuente de Datos: {realStats ? 'Backend Real' : 'Datos Mock'}
              </span>
            </div>
            {loading && (
              <Badge variant="secondary">Cargando...</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
