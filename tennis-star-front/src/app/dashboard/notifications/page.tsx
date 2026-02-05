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
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Bell,
  Send,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
  Calendar,
  Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para notificaciones
const mockNotifications = [
  {
    id: 1,
    title: 'Nueva Colección Verano 2026',
    message: 'Descubre nuestra nueva colección de calzado de verano con descuentos exclusivos para miembros.',
    type: 'PROMOTION',
    channel: 'EMAIL',
    status: 'sent',
    targetAudience: 'ALL',
    sentCount: 2847,
    openCount: 1256,
    clickCount: 234,
    scheduledAt: '2026-02-01T10:00:00Z',
    sentAt: '2026-02-01T10:05:00Z',
    createdAt: '2026-01-31T15:30:00Z'
  },
  {
    id: 2,
    title: 'Recordatorio: Carrito Abandonado',
    message: '¡No olvides los productos en tu carrito! Completa tu compra antes de que se agoten.',
    type: 'CART_ABANDONED',
    channel: 'PUSH',
    status: 'scheduled',
    targetAudience: 'CUSTOMERS_WITH_CART',
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    scheduledAt: '2026-02-06T09:00:00Z',
    sentAt: null,
    createdAt: '2026-02-05T14:20:00Z'
  },
  {
    id: 3,
    title: 'Bienvenida a Tennis Star',
    message: 'Gracias por unirte a Tennis Star. Aquí tienes un 10% de descuento en tu primera compra.',
    type: 'WELCOME',
    channel: 'EMAIL',
    status: 'sent',
    targetAudience: 'NEW_CUSTOMERS',
    sentCount: 156,
    openCount: 134,
    clickCount: 89,
    scheduledAt: null,
    sentAt: '2026-02-04T08:00:00Z',
    createdAt: '2026-02-04T07:30:00Z'
  },
  {
    id: 4,
    title: 'Stock Bajo: Nike Air Max 90',
    message: '¡Últimas unidades! Los modelos más populares de Nike Air Max 90 se están agotando.',
    type: 'LOW_STOCK',
    channel: 'SMS',
    status: 'draft',
    targetAudience: 'INTERESTED_CUSTOMERS',
    sentCount: 0,
    openCount: 0,
    clickCount: 0,
    scheduledAt: null,
    sentAt: null,
    createdAt: '2026-02-05T11:45:00Z'
  },
  {
    id: 5,
    title: 'Mantenimiento Programado',
    message: 'El sistema estará en mantenimiento por 2 horas el domingo de 2:00 AM a 4:00 AM.',
    type: 'SYSTEM',
    channel: 'EMAIL',
    status: 'sent',
    targetAudience: 'ALL',
    sentCount: 2847,
    openCount: 1892,
    clickCount: 45,
    scheduledAt: '2026-02-03T16:00:00Z',
    sentAt: '2026-02-03T16:05:00Z',
    createdAt: '2026-02-03T15:00:00Z'
  }
];

export default function NotificationsPage() {
  const { user, isAdmin, isStaff } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'PROMOTION',
    channel: 'EMAIL',
    targetAudience: 'ALL',
    scheduledAt: ''
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingNotification) {
      setNotifications(prev => prev.map(notification => 
        notification.id === editingNotification.id 
          ? { ...notification, ...formData }
          : notification
      ));
    } else {
      const newNotification = {
        id: Math.max(...notifications.map(n => n.id)) + 1,
        ...formData,
        status: 'draft',
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        sentAt: null,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [...prev, newNotification]);
    }

    setFormData({ title: '', message: '', type: 'PROMOTION', channel: 'EMAIL', targetAudience: 'ALL', scheduledAt: '' });
    setEditingNotification(null);
    setIsModalOpen(false);
  };

  const handleEdit = (notification: any) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      channel: notification.channel,
      targetAudience: notification.targetAudience,
      scheduledAt: notification.scheduledAt ? new Date(notification.scheduledAt).toISOString().slice(0, 16) : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (notificationId: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const handleSend = (notificationId: number) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: 'sent', sentAt: new Date().toISOString(), sentCount: 2847 }
        : notification
    ));
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      'draft': { label: 'Borrador', color: 'bg-gray-100 text-gray-800', icon: Edit },
      'scheduled': { label: 'Programada', color: 'bg-blue-100 text-blue-800', icon: Clock },
      'sent': { label: 'Enviada', color: 'bg-green-100 text-green-800', icon: Send },
      'failed': { label: 'Fallida', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const badge = badges[status as keyof typeof badges] || badges['draft'];
    const Icon = badge.icon;
    
    return (
      <Badge variant="outline" className={badge.color}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      'EMAIL': Mail,
      'SMS': Smartphone,
      'PUSH': MessageSquare,
      'IN_APP': Bell
    };
    const Icon = icons[channel as keyof typeof icons] || Mail;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      'PROMOTION': { label: 'Promoción', color: 'bg-purple-100 text-purple-800' },
      'WELCOME': { label: 'Bienvenida', color: 'bg-green-100 text-green-800' },
      'CART_ABANDONED': { label: 'Carrito Abandonado', color: 'bg-orange-100 text-orange-800' },
      'LOW_STOCK': { label: 'Stock Bajo', color: 'bg-red-100 text-red-800' },
      'SYSTEM': { label: 'Sistema', color: 'bg-blue-100 text-blue-800' }
    };
    
    const badge = badges[type as keyof typeof badges] || badges['PROMOTION'];
    
    return (
      <Badge variant="outline" className={badge.color}>
        {badge.label}
      </Badge>
    );
  };

  const getOpenRate = (openCount: number, sentCount: number) => {
    if (sentCount === 0) return '0%';
    return `${Math.round((openCount / sentCount) * 100)}%`;
  };

  const getClickRate = (clickCount: number, openCount: number) => {
    if (openCount === 0) return '0%';
    return `${Math.round((clickCount / openCount) * 100)}%`;
  };

  // Restringir acceso según rol
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
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-gray-600">
              {isAdmin ? 'Gestiona las comunicaciones con los clientes' : 'Revisa el historial de notificaciones'}
            </p>
          </div>
          {isAdmin && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Notificación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingNotification ? 'Editar Notificación' : 'Nueva Notificación'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingNotification 
                      ? 'Modifica los detalles de la notificación existente.'
                      : 'Crea una nueva notificación para enviar a los clientes.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Ej: Nueva Colección Verano"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PROMOTION">Promoción</SelectItem>
                            <SelectItem value="WELCOME">Bienvenida</SelectItem>
                            <SelectItem value="CART_ABANDONED">Carrito Abandonado</SelectItem>
                            <SelectItem value="LOW_STOCK">Stock Bajo</SelectItem>
                            <SelectItem value="SYSTEM">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Escribe el mensaje de la notificación..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="channel">Canal</Label>
                        <Select value={formData.channel} onValueChange={(value) => setFormData(prev => ({ ...prev, channel: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Canal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMAIL">Email</SelectItem>
                            <SelectItem value="SMS">SMS</SelectItem>
                            <SelectItem value="PUSH">Push</SelectItem>
                            <SelectItem value="IN_APP">In App</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="targetAudience">Audiencia</Label>
                        <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Audiencia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ALL">Todos</SelectItem>
                            <SelectItem value="NEW_CUSTOMERS">Nuevos Clientes</SelectItem>
                            <SelectItem value="CUSTOMERS_WITH_CART">Con Carrito</SelectItem>
                            <SelectItem value="INTERESTED_CUSTOMERS">Interesados</SelectItem>
                            <SelectItem value="VIP_MEMBERS">Miembros VIP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="scheduledAt">Programar Envío</Label>
                        <Input
                          id="scheduledAt"
                          type="datetime-local"
                          value={formData.scheduledAt}
                          onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingNotification ? 'Guardar Cambios' : 'Crear Notificación'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Enviadas</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.status === 'sent').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa Apertura</CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  notifications
                    .filter(n => n.status === 'sent')
                    .reduce((sum, n) => sum + (n.openCount / n.sentCount), 0) /
                    notifications.filter(n => n.status === 'sent').length * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa Clic</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  notifications
                    .filter(n => n.status === 'sent')
                    .reduce((sum, n) => sum + (n.clickCount / n.openCount), 0) /
                    notifications.filter(n => n.status === 'sent').length * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programadas</CardTitle>
              <Calendar className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.status === 'scheduled').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendientes
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
                  placeholder="Buscar notificaciones..."
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

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones ({filteredNotifications.length})</CardTitle>
            <CardDescription>
              Historial completo de notificaciones enviadas y programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Cargando notificaciones...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Enviadas</TableHead>
                    <TableHead>Apertura</TableHead>
                    <TableHead>Clics</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {notification.message}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(notification.type)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getChannelIcon(notification.channel)}
                          <span className="text-sm">{notification.channel}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(notification.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{notification.sentCount}</div>
                          {notification.targetAudience !== 'ALL' && (
                            <div className="text-gray-500">{notification.targetAudience}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{getOpenRate(notification.openCount, notification.sentCount)}</div>
                          <div className="text-gray-500">{notification.openCount}/{notification.sentCount}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{getClickRate(notification.clickCount, notification.openCount)}</div>
                          <div className="text-gray-500">{notification.clickCount}/{notification.openCount}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(notification.createdAt).toLocaleDateString('es-ES')}</div>
                          {notification.scheduledAt && (
                            <div className="text-gray-500">
                              Programada: {new Date(notification.scheduledAt).toLocaleDateString('es-ES')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isAdmin && notification.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSend(notification.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(notification)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
