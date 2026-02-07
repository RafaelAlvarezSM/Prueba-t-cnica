'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  X, 
  Truck, 
  CheckCircle, 
  Clock, 
  Package,
  CreditCard,
  MapPin,
  User,
  Calendar,
  Edit
} from 'lucide-react';

interface ManageOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order?: any;
}

interface TimelineItem {
  id: string;
  status: string;
  date: string;
  time: string;
  responsible: string;
}

export default function ManageOrderModal({ 
  open, 
  onOpenChange, 
  order 
}: ManageOrderModalProps) {
  const [statusNotes, setStatusNotes] = useState('');

  // Datos mock para demostración
  const mockOrder = {
    id: 'ORD-2024-001',
    orderNumber: 'AB1850E7',
    status: 'ENVIADO',
    customerName: 'Jaime González Correa',
    customerEmail: 'jaime.gonzalez@email.com',
    customerPhone: '+54 11 1234-5678',
    customerId: 'CUS-0042',
    paymentMethod: 'Tarjeta de Crédito',
    paymentStatus: 'PAGADO',
    total: 389.97,
    shippingAddress: 'Av. Corrientes 1234, Piso 4, Depto B, Buenos Aires, C1000, Argentina',
    trackingNumber: 'TRK123456789AR',
    createdAt: '2024-02-02T18:00:00.000Z',
    items: [
      {
        id: '1',
        name: 'Nike Air Max 90',
        quantity: 1,
        price: 189.99
      },
      {
        id: '2',
        name: 'Adidas Ultraboost 22',
        quantity: 1,
        price: 199.98
      }
    ]
  };

  const currentOrder = order || mockOrder;

  // Timeline mock de historial de modificaciones
  const timeline: TimelineItem[] = [
    {
      id: '1',
      status: 'PENDIENTE',
      date: '02/02/2024',
      time: '14:30',
      responsible: 'Sistema'
    },
    {
      id: '2',
      status: 'EN PREPARACIÓN',
      date: '02/02/2024',
      time: '15:45',
      responsible: 'María Rodríguez'
    },
    {
      id: '3',
      status: 'ENVIADO',
      date: '02/02/2024',
      time: '18:00',
      responsible: 'Armando admin'
    }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      'PENDIENTE': 'bg-blue-50 text-blue-700 border border-blue-200',
      'EN PREPARACIÓN': 'bg-orange-50 text-orange-700 border border-orange-200',
      'ENVIADO': 'bg-blue-50 text-blue-700 border border-blue-200',
      'ENTREGADO': 'bg-green-50 text-green-700 border border-green-200',
      'CANCELADO': 'bg-red-50 text-red-700 border border-red-200'
    };

    return (
      <Badge 
        variant="outline" 
        className={colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-700 border border-gray-200'}
      >
        <Truck className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    return (
      <Badge 
        variant="outline" 
        className="bg-slate-900 text-white border border-slate-900"
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCompleteOrder = () => {
    console.log('Completando pedido:', currentOrder.id);
    console.log('Notas:', statusNotes);
    // Aquí iría la lógica para completar el pedido
    onOpenChange(false);
    setStatusNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] rounded-xl shadow-lg flex flex-col">
        {/* Cabecera Fija */}
        <DialogHeader className="border-b pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-slate-700" />
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Gestionar Orden
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Área de Scroll Interno */}
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 py-6">
            {/* Sección Superior - Estado Actual */}
            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusBadge(currentOrder.status)}
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Orden #{currentOrder.orderNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid de Dos Columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna Izquierda - Información del Cliente */}
              <Card className="border border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-600" />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-900">{currentOrder.customerName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-900">{currentOrder.customerEmail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <p className="text-sm text-slate-900">{currentOrder.customerPhone}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <Label className="text-xs text-slate-500">ID</Label>
                      <p className="text-sm font-mono text-slate-900">{currentOrder.customerId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Columna Derecha - Información de Pago */}
              <Card className="border border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-slate-600" />
                    Información de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <Label className="text-xs text-slate-500">Método</Label>
                      <p className="text-sm text-slate-900">{currentOrder.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <Label className="text-xs text-slate-500">Estado del Pago</Label>
                      <div className="mt-1">
                        {getPaymentBadge(currentOrder.paymentStatus)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <Label className="text-xs text-slate-500">Total</Label>
                      <p className="text-lg font-semibold text-slate-900">${currentOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sección de Envío */}
            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-slate-600 mt-0.5" />
                  <div className="flex-1">
                    <Label className="text-xs text-slate-500">Dirección de Envío</Label>
                    <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-md border border-slate-200">
                      {currentOrder.shippingAddress}
                    </p>
                    <div className="mt-3">
                      <Label className="text-xs text-slate-500">Número de Tracking</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input 
                          value={currentOrder.trackingNumber} 
                          readOnly
                          className="font-mono text-sm bg-slate-50 border border-slate-200"
                        />
                        <Button variant="outline" size="sm" className="border-slate-200">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historial de Modificaciones */}
            <Card className="border border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-600" />
                  Historial de Modificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          item.status === currentOrder.status 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'bg-slate-300 border-slate-300'
                        }`}></div>
                        {index < timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-slate-200 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="h-3 w-3 text-blue-600" />
                            <span className="text-sm font-medium text-slate-900">
                              {item.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {item.date} a las {item.time}
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Por: {item.responsible}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notas de Cambio */}
            <Card className="border border-slate-200">
              <CardContent className="p-4">
                <Label className="text-xs text-slate-500">Notas para el cambio de estado (opcional)</Label>
                <Textarea
                  placeholder="Agregar notas..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  className="resize-none border-slate-200 text-sm"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pie Fijo */}
        <div className="border-t pt-6 flex-shrink-0">
          <Button
            onClick={handleCompleteOrder}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Completar Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
