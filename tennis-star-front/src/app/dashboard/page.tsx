'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  Bell,
  Moon,
  Sun,
  User
} from 'lucide-react';

// Mock data para el dashboard
const mockInventory = {
  total: 128,
  totalValue: 190192.00,
  products: [
    { id: 'ID3715', name: 'Tenis Adidas VL Court Base', units: 2 },
    { id: 'ID3716', name: 'Nike Air Max 90', units: 5 },
    { id: 'ID3717', name: 'Puma RS-X', units: 3 },
    { id: 'ID3718', name: 'New Balance 574', units: 8 }
  ]
};

const mockRecentSales = [
  {
    id: 1,
    customerName: 'Juan Pérez',
    orderId: 'ORD-2024-001',
    status: 'Completado',
    date: '2024-02-05 14:30',
    amount: 259.99
  },
  {
    id: 2,
    customerName: 'María García',
    orderId: 'ORD-2024-002',
    status: 'En Proceso',
    date: '2024-02-05 13:15',
    amount: 189.99
  },
  {
    id: 3,
    customerName: 'Carlos López',
    orderId: 'ORD-2024-003',
    status: 'Completado',
    date: '2024-02-05 12:45',
    amount: 129.99
  },
  {
    id: 4,
    customerName: 'Ana Martínez',
    orderId: 'ORD-2024-004',
    status: 'Pendiente',
    date: '2024-02-05 11:20',
    amount: 349.99
  }
];

export default function DashboardPage() {
  const { user, isAdmin, isStaff, isCliente } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Redirección basada en rol
  useEffect(() => {
    if (isCliente) {
      window.location.href = '/dashboard/products';
    }
  }, [isCliente]);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Completado': 'default',
      'En Proceso': 'secondary',
      'Pendiente': 'outline'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}

      {/* Main Content */}
      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Inventario de Productos - Izquierda */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Inventario de Productos</CardTitle>
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <CardDescription>
                Gestiona tu stock y productos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Productos</p>
                  <p className="text-2xl font-bold">{mockInventory.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Total</p>
                  <p className="text-2xl font-bold">${mockInventory.totalValue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Productos Detallados</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockInventory.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{product.units} uds.</span>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Todos
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ventas Recientes - Centro */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Ventas Recientes</CardTitle>
                <ShoppingCart className="h-5 w-5 text-green-500" />
              </div>
              <CardDescription>
                Últimas transacciones realizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockRecentSales.map((sale) => (
                <Card key={sale.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{sale.customerName}</h4>
                        {getStatusBadge(sale.status)}
                      </div>
                      <p className="text-xs text-gray-500">{sale.orderId}</p>
                      <p className="text-xs text-gray-500">{sale.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${sale.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Productos Más Vendidos - Derecha */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Productos Más Vendidos</CardTitle>
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <CardDescription>
                Los productos con mayor demanda
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No hay productos top para mostrar</p>
                <p className="text-sm text-gray-400">Los productos más vendidos aparecerán aquí</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
