'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Eye,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Datos mock para estadísticas
const mockStats = {
  totalSales: 125430,
  salesGrowth: 12.5,
  totalOrders: 3420,
  ordersGrowth: 8.2,
  totalCustomers: 8920,
  customersGrowth: 15.3,
  totalProducts: 485,
  productsGrowth: 5.7,
  conversionRate: 3.2,
  avgOrderValue: 36.68,
  topProducts: [
    { name: 'Nike Air Max 90', sales: 342, revenue: 44460 },
    { name: 'Adidas Ultraboost', sales: 289, revenue: 43350 },
    { name: 'Puma RS-X', sales: 198, revenue: 17820 },
    { name: 'New Balance 574', sales: 156, revenue: 12480 },
    { name: 'Reebok Classic', sales: 134, revenue: 10720 }
  ],
  recentActivity: [
    { id: 1, type: 'sale', description: 'Nueva venta #ORD-3421', amount: 129.99, time: 'Hace 2 minutos' },
    { id: 2, type: 'user', description: 'Nuevo usuario registrado', amount: null, time: 'Hace 5 minutos' },
    { id: 3, type: 'sale', description: 'Nueva venta #ORD-3420', amount: 89.99, time: 'Hace 8 minutos' },
    { id: 4, type: 'product', description: 'Producto agregado: Nike Zoom', amount: null, time: 'Hace 15 minutos' },
    { id: 5, type: 'sale', description: 'Nueva venta #ORD-3419', amount: 156.50, time: 'Hace 22 minutos' }
  ]
};

export default function AnalyticsPage() {
  const { isAdmin } = useAuth();

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="text-muted-foreground">
          Vista general del rendimiento y métricas clave
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
            <div className="text-2xl font-bold">${mockStats.totalSales.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">{mockStats.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{mockStats.ordersGrowth}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Totales</CardTitle>
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
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tasa de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockStats.conversionRate}%</div>
            <p className="text-sm text-muted-foreground">
              Porcentaje de visitantes que realizan una compra
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Valor Promedio de Orden
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${mockStats.avgOrderValue}</div>
            <p className="text-sm text-muted-foreground">
              Promedio de gasto por cliente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Más Vendidos</CardTitle>
          <CardDescription>
            Los 5 productos con mayor número de ventas este mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} ventas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
          <CardDescription>
            Últimas actividades en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'sale' ? 'bg-green-500' :
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'product' ? 'bg-purple-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-medium">${activity.amount}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
