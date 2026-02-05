'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Package, 
  User, 
  CreditCard, 
  Truck, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface OrderDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: any;
}

// Mock data para demostración
const mockOrder = {
  id: 'ORD-0001',
  orderNumber: 'AB1850E7',
  status: 'ENVIADO',
  paymentMethod: 'TARJETA',
  total: 389.97,
  notes: 'Venta directa de mostrador',
  createdAt: '2026-02-02T18:00:00.000Z',
  user: {
    id: 'user-001',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+54 11 1234-5678'
  },
  items: [
    {
      id: 'item-001',
      quantity: 2,
      price: 129.99,
      productOption: {
        id: 'opt-001',
        product: {
          id: 'prod-001',
          name: 'Nike Air Max 90',
          sku: 'NKE-001',
          brandName: 'Nike'
        },
        size: '42',
        color: 'Negro'
      }
    },
    {
      id: 'item-002',
      quantity: 1,
      price: 129.99,
      productOption: {
        id: 'opt-002',
        product: {
          id: 'prod-002',
          name: 'Nike Air Max 90',
          sku: 'NKE-001',
          brandName: 'Nike'
        },
        size: '41',
        color: 'Blanco'
      }
    }
  ],
  shippingAddress: {
    address: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1043',
    country: 'Argentina'
  },
  histories: [
    {
      id: 'hist-001',
      status: 'PENDIENTE',
      notes: 'Orden creada',
      createdAt: '2026-02-02T18:00:00.000Z',
      admin: {
        name: 'Admin System'
      }
    },
    {
      id: 'hist-002',
      status: 'ENVIADO',
      notes: 'Orden enviada al cliente',
      createdAt: '2026-02-02T19:30:00.000Z',
      admin: {
        name: 'Carlos García'
      }
    }
  ]
};

export function OrderDetailModal({ open, onOpenChange, order }: OrderDetailModalProps) {
  // Usar datos reales si existen, si no usar mock
  const orderData = order || mockOrder;
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
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'PENDIENTE': <Clock className="h-4 w-4 text-orange-500" />,
      'ENVIADO': <Truck className="h-4 w-4 text-blue-500" />,
      'ENTREGADO': <CheckCircle className="h-4 w-4 text-green-500" />,
      'CANCELADO': <XCircle className="h-4 w-4 text-red-500" />
    };
    return icons[status as keyof typeof icons] || <AlertTriangle className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalle de Orden #{orderData.orderNumber}
          </DialogTitle>
          <DialogDescription>
            Información completa de la orden y su historial
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado Actual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getStatusIcon(orderData.status)}
                Estado Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(orderData.status)}
                    <span className="text-sm text-muted-foreground">
                      Actualizado: {new Date(orderData.histories[orderData.histories.length - 1]?.createdAt || orderData.createdAt).toLocaleString('es-ES')}
                    </span>
                  </div>
                  {orderData.notes && (
                    <p className="text-sm text-muted-foreground">{orderData.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${orderData.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orderData.user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">{orderData.user.name}</p>
                    <p className="text-sm text-muted-foreground">{orderData.user.email}</p>
                    {orderData.user.phone && (
                      <p className="text-sm text-muted-foreground">{orderData.user.phone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">ID Cliente</p>
                    <p className="font-mono text-sm">{orderData.user.id}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Venta sin cliente registrado</p>
              )}
            </CardContent>
          </Card>

          {/* Información de Pago */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pago</p>
                  <p className="font-medium">{orderData.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="font-medium">${(orderData.total / 1.16).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IVA (16%)</p>
                  <p className="font-medium">${((orderData.total / 1.16) * 0.16).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items de la Orden */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productos ({orderData.items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.productOption.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.productOption.product.sku} | 
                          Talla: {item.productOption.size} | 
                          Color: {item.productOption.color}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dirección de Envío */}
          {orderData.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{orderData.shippingAddress.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CP: {orderData.shippingAddress.postalCode}, {orderData.shippingAddress.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial de Modificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de Modificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderData.histories.map((history: any, index: number) => (
                  <div key={history.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(history.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(history.status)}
                          <span className="font-medium">{history.notes}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(history.createdAt).toLocaleString('es-ES')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Por: {history.admin.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button>
              Imprimir Orden
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
