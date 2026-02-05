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
  CreditCard,
  Crown,
  Star,
  Shield,
  Zap,
  Gift,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para membresías
const mockMemberships = [
  {
    id: 1,
    name: 'Básico',
    price: 0,
    duration: 'lifetime',
    features: [
      'Acceso al catálogo de productos',
      'Creación de cuenta',
      'Seguimiento de pedidos',
      'Soporte por email'
    ],
    benefits: [
      'Sin costo de membresía',
      'Acceso básico a la tienda'
    ],
    memberCount: 2847,
    activeCount: 2156,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Shield,
    popular: false
  },
  {
    id: 2,
    name: 'Silver',
    price: 29.99,
    duration: 'monthly',
    features: [
      'Todo lo de Básico',
      'Descuentos exclusivos 5%',
      'Envío gratis en compras > $1500',
      'Acceso anticipado a ofertas',
      'Programa de lealtad 2x puntos'
    ],
    benefits: [
      'Ahorro promedio de $200/mes',
      'Prioridad en atención al cliente',
      'Invitaciones a eventos especiales'
    ],
    memberCount: 892,
    activeCount: 756,
    color: 'bg-slate-100 text-slate-800 border-slate-200',
    icon: Star,
    popular: false
  },
  {
    id: 3,
    name: 'Gold',
    price: 59.99,
    duration: 'monthly',
    features: [
      'Todo lo de Silver',
      'Descuentos exclusivos 10%',
      'Envío gratis siempre',
      'Acceso VIP a nuevos productos',
      'Programa de lealtad 3x puntos',
      'Devoluciones gratuitas',
      'Seguro de compra'
    ],
    benefits: [
      'Ahorro promedio de $500/mes',
      'Gerente de cuenta dedicado',
      'Acceso a sala VIP en eventos',
      'Regalos de cumpleaños exclusivos'
    ],
    memberCount: 456,
    activeCount: 423,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Crown,
    popular: true
  },
  {
    id: 4,
    name: 'Platinum',
    price: 99.99,
    duration: 'monthly',
    features: [
      'Todo lo de Gold',
      'Descuentos exclusivos 15%',
      'Envío express gratis',
      'Acceso exclusivo a productos limitados',
      'Programa de lealtad 5x puntos',
      'Devoluciones sin límite',
      'Seguro de compra premium',
      'Crédito de tienda $500/mes',
      'Eventos privados exclusivos'
    ],
    benefits: [
      'Ahorro promedio de $1200/mes',
      'Concierge personal 24/7',
      'Acceso a instalaciones exclusivas',
      'Viajes y experiencias VIP'
    ],
    memberCount: 123,
    activeCount: 118,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Zap,
    popular: false
  }
];

// Mock data para suscripciones
const mockSubscriptions = [
  { 
    id: 1, 
    customerName: 'Juan Pérez', 
    customerEmail: 'juan@example.com', 
    membership: 'Gold', 
    status: 'active', 
    startDate: '2026-01-15', 
    nextBilling: '2026-02-15',
    amount: 59.99,
    autoRenew: true
  },
  { 
    id: 2, 
    customerName: 'María García', 
    customerEmail: 'maria@example.com', 
    membership: 'Silver', 
    status: 'active', 
    startDate: '2026-01-20', 
    nextBilling: '2026-02-20',
    amount: 29.99,
    autoRenew: true
  },
  { 
    id: 3, 
    customerName: 'Carlos López', 
    customerEmail: 'carlos@example.com', 
    membership: 'Platinum', 
    status: 'cancelled', 
    startDate: '2025-12-01', 
    nextBilling: null,
    amount: 99.99,
    autoRenew: false
  },
  { 
    id: 4, 
    customerName: 'Ana Martínez', 
    customerEmail: 'ana@example.com', 
    membership: 'Gold', 
    status: 'active', 
    startDate: '2026-02-01', 
    nextBilling: '2026-03-01',
    amount: 59.99,
    autoRenew: true
  },
  { 
    id: 5, 
    customerName: 'Roberto Díaz', 
    customerEmail: 'roberto@example.com', 
    membership: 'Básico', 
    status: 'active', 
    startDate: '2025-11-15', 
    nextBilling: null,
    amount: 0,
    autoRenew: false
  }
];

export default function MembershipsPage() {
  const { isAdmin } = useAuth();
  const [memberships, setMemberships] = useState(mockMemberships);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('memberships');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: 'monthly',
    features: '',
    benefits: '',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSubscriptions = subscriptions.filter(subscription =>
    subscription.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subscription.membership.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMembership) {
      setMemberships(prev => prev.map(membership => 
        membership.id === editingMembership.id 
          ? { 
              ...membership, 
              ...formData, 
              price: parseFloat(formData.price),
              features: formData.features.split(',').map(f => f.trim()),
              benefits: formData.benefits.split(',').map(b => b.trim())
            }
          : membership
      ));
    } else {
      const newMembership = {
        id: Math.max(...memberships.map(m => m.id)) + 1,
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.split(',').map(f => f.trim()),
        benefits: formData.benefits.split(',').map(b => b.trim()),
        memberCount: 0,
        activeCount: 0,
        icon: Shield,
        popular: false
      };
      setMemberships(prev => [...prev, newMembership]);
    }

    setFormData({ name: '', price: '', duration: 'monthly', features: '', benefits: '', color: 'bg-blue-100 text-blue-800 border-blue-200' });
    setEditingMembership(null);
    setIsModalOpen(false);
  };

  const handleEdit = (membership: any) => {
    setEditingMembership(membership);
    setFormData({
      name: membership.name,
      price: membership.price.toString(),
      duration: membership.duration,
      features: membership.features.join(', '),
      benefits: membership.benefits.join(', '),
      color: membership.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = (membershipId: number) => {
    setMemberships(prev => prev.filter(membership => membership.id !== membershipId));
  };

  const getMembershipIcon = (iconName: string) => {
    const icons = {
      Shield, Star, Crown, Zap
    };
    const Icon = icons[iconName as keyof typeof icons] || Shield;
    return <Icon className="h-6 w-6" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Activa
        </Badge>
      );
    } else if (status === 'cancelled') {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          Cancelada
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          Pendiente
        </Badge>
      );
    }
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Membresías</h1>
          <p className="text-gray-600">Gestiona los planes de membresía y suscripciones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memberships.reduce((sum, m) => sum + m.memberCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Todos los planes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {memberships.reduce((sum, m) => sum + m.activeCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Suscripciones activas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                ${subscriptions
                  .filter(s => s.status === 'active')
                  .reduce((sum, s) => sum + s.amount, 0)
                  .toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Recurring revenue
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Retención</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(
                  (memberships.reduce((sum, m) => sum + m.activeCount, 0) /
                   memberships.reduce((sum, m) => sum + m.memberCount, 0)) * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                De los miembros
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('memberships')}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'memberships'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Planes de Membresía
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Suscripciones
            </button>
          </nav>
        </div>

        {/* Memberships Tab */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Planes de Membresía</h2>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMembership ? 'Editar Plan' : 'Nuevo Plan de Membresía'}
                    </DialogTitle>
                    <DialogDescription>
                      Configura los beneficios y características del plan
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre del Plan</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Gold"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Precio</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="29.99"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="duration">Duración</Label>
                          <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Duración" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Mensual</SelectItem>
                              <SelectItem value="yearly">Anual</SelectItem>
                              <SelectItem value="lifetime">Vitalicia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="features">Características (separadas por comas)</Label>
                        <textarea
                          id="features"
                          value={formData.features}
                          onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                          placeholder="Acceso al catálogo, Descuentos exclusivos, Envío gratis"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          rows={3}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="benefits">Beneficios Adicionales (separados por comas)</Label>
                        <textarea
                          id="benefits"
                          value={formData.benefits}
                          onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                          placeholder="Ahorro promedio, Atención prioritaria, Eventos exclusivos"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        {editingMembership ? 'Guardar Cambios' : 'Crear Plan'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {memberships.map((membership) => (
                <Card key={membership.id} className={`relative overflow-hidden ${membership.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {membership.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${membership.color}`}>
                        {getMembershipIcon(membership.icon.name)}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{membership.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      ${membership.price}
                      <span className="text-sm font-normal text-gray-500">
                        /{membership.duration === 'monthly' ? 'mes' : membership.duration === 'yearly' ? 'año' : 'vida'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Características:</h4>
                      <ul className="text-sm space-y-1">
                        {membership.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {membership.features.length > 4 && (
                          <li className="text-gray-400">+{membership.features.length - 4} más...</li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Beneficios:</h4>
                      <ul className="text-sm space-y-1">
                        {membership.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Gift className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                        {membership.benefits.length > 2 && (
                          <li className="text-gray-400">+{membership.benefits.length - 2} más...</li>
                        )}
                      </ul>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Miembros:</span>
                          <span className="font-medium">{membership.memberCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Activos:</span>
                          <span className="font-medium text-green-600">{membership.activeCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(membership)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(membership.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Suscripciones Activas</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar suscripciones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Suscripciones ({filteredSubscriptions.length})</CardTitle>
                <CardDescription>
                  Gestiona las suscripciones de los miembros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Cargando suscripciones...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Membresía</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Próximo Pago</TableHead>
                        <TableHead>Auto-renovar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{subscription.customerName}</div>
                              <div className="text-sm text-gray-500">{subscription.customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{subscription.membership}</Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(subscription.status)}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              ${subscription.amount}
                              <span className="text-sm text-gray-500">/mes</span>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(subscription.startDate).toLocaleDateString('es-ES')}</TableCell>
                          <TableCell>
                            {subscription.nextBilling ? 
                              new Date(subscription.nextBilling).toLocaleDateString('es-ES') : 
                              'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={subscription.autoRenew ? 'default' : 'secondary'}>
                              {subscription.autoRenew ? 'Sí' : 'No'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
