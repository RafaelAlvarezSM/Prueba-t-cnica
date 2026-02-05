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
  Gift,
  Star,
  Trophy,
  Crown,
  Diamond,
  TrendingUp,
  Users,
  Target,
  Award,
  Coins
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para niveles de lealtad
const mockLoyaltyLevels = [
  {
    id: 1,
    name: 'Bronce',
    icon: Trophy,
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    minPoints: 0,
    maxPoints: 99,
    benefits: ['1 punto por cada $10', 'Descuento 5% en cumpleaños', 'Envío gratis en compras > $2000'],
    memberCount: 1250,
    averagePoints: 45
  },
  {
    id: 2,
    name: 'Plata',
    icon: Star,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    minPoints: 100,
    maxPoints: 499,
    benefits: ['1.5 puntos por cada $10', 'Descuento 10% en cumpleaños', 'Envío gratis en compras > $1500', 'Acceso anticipado a ofertas'],
    memberCount: 890,
    averagePoints: 275
  },
  {
    id: 3,
    name: 'Oro',
    icon: Crown,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    minPoints: 500,
    maxPoints: 999,
    benefits: ['2 puntos por cada $10', 'Descuento 15% en cumpleaños', 'Envío gratis siempre', 'Acceso VIP a eventos', 'Servicio prioritario'],
    memberCount: 456,
    averagePoints: 678
  },
  {
    id: 4,
    name: 'Platino',
    icon: Diamond,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    minPoints: 1000,
    maxPoints: Infinity,
    benefits: ['3 puntos por cada $10', 'Descuento 20% en cumpleaños', 'Envío gratis siempre', 'Acceso exclusivo a productos', 'Gerente personal', 'Eventos exclusivos'],
    memberCount: 123,
    averagePoints: 1456
  }
];

// Mock data para transacciones de puntos
const mockTransactions = [
  { id: 1, customerName: 'Juan Pérez', customerEmail: 'juan@example.com', points: 50, type: 'earned', reason: 'Compra de $500', date: '2026-02-05', balance: 250 },
  { id: 2, customerName: 'María García', customerEmail: 'maria@example.com', points: -25, type: 'redeemed', reason: 'Descuento $25', date: '2026-02-05', balance: 175 },
  { id: 3, customerName: 'Carlos López', customerEmail: 'carlos@example.com', points: 100, type: 'earned', reason: 'Compra de $1000', date: '2026-02-04', balance: 890 },
  { id: 4, customerName: 'Ana Martínez', customerEmail: 'ana@example.com', points: 15, type: 'earned', reason: 'Registro nuevo cliente', date: '2026-02-04', balance: 15 },
  { id: 5, customerName: 'Roberto Díaz', customerEmail: 'roberto@example.com', points: -50, type: 'redeemed', reason: 'Envío gratis', date: '2026-02-03', balance: 450 }
];

export default function LoyaltyPage() {
  const { isAdmin } = useAuth();
  const [levels, setLevels] = useState(mockLoyaltyLevels);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('levels');
  const [formData, setFormData] = useState({
    name: '',
    minPoints: '',
    maxPoints: '',
    benefits: '',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  });

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLevel) {
      setLevels(prev => prev.map(level => 
        level.id === editingLevel.id 
          ? { 
              ...level, 
              ...formData, 
              minPoints: parseInt(formData.minPoints),
              maxPoints: formData.maxPoints === '' ? Infinity : parseInt(formData.maxPoints),
              benefits: formData.benefits.split(',').map(b => b.trim())
            }
          : level
      ));
    } else {
      const newLevel = {
        id: Math.max(...levels.map(l => l.id)) + 1,
        ...formData,
        minPoints: parseInt(formData.minPoints),
        maxPoints: formData.maxPoints === '' ? Infinity : parseInt(formData.maxPoints),
        benefits: formData.benefits.split(',').map(b => b.trim()),
        icon: Trophy,
        memberCount: 0,
        averagePoints: 0
      };
      setLevels(prev => [...prev, newLevel]);
    }

    setFormData({ name: '', minPoints: '', maxPoints: '', benefits: '', color: 'bg-blue-100 text-blue-800 border-blue-200' });
    setEditingLevel(null);
    setIsModalOpen(false);
  };

  const handleEdit = (level: any) => {
    setEditingLevel(level);
    setFormData({
      name: level.name,
      minPoints: level.minPoints.toString(),
      maxPoints: level.maxPoints === Infinity ? '' : level.maxPoints.toString(),
      benefits: level.benefits.join(', '),
      color: level.color
    });
    setIsModalOpen(true);
  };

  const handleDelete = (levelId: number) => {
    setLevels(prev => prev.filter(level => level.id !== levelId));
  };

  const getLevelIcon = (iconName: string) => {
    const icons = {
      Trophy, Star, Crown, Diamond
    };
    const Icon = icons[iconName as keyof typeof icons] || Trophy;
    return <Icon className="h-5 w-5" />;
  };

  const getTransactionBadge = (type: string) => {
    if (type === 'earned') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <TrendingUp className="h-3 w-3 mr-1" />
          Ganados
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <Coins className="h-3 w-3 mr-1" />
          Canjeados
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
          <h1 className="text-3xl font-bold text-gray-900">Puntos de Lealtad</h1>
          <p className="text-gray-600">Gestiona el programa de lealtad y niveles de membresía</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Miembros Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {levels.reduce((sum, level) => sum + level.memberCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Clientes activos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntos Emitidos</CardTitle>
              <Trophy className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Puntos Canjeados</CardTitle>
              <Coins className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {Math.abs(transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + t.points, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Canje</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(
                  (Math.abs(transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + t.points, 0)) /
                   transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0)) * 100
                )}%
              </div>
              <p className="text-xs text-muted-foreground">
                De los puntos ganados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('levels')}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'levels'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award className="mr-2 h-4 w-4" />
              Niveles de Membresía
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Transacciones
            </button>
          </nav>
        </div>

        {/* Levels Tab */}
        {activeTab === 'levels' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Niveles de Membresía</h2>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Nivel
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLevel ? 'Editar Nivel' : 'Nuevo Nivel de Membresía'}
                    </DialogTitle>
                    <DialogDescription>
                      Configura los beneficios y requisitos del nivel
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Nombre del Nivel</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Oro"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="color">Color del Badge</Label>
                          <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona color" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bg-amber-100 text-amber-800 border-amber-200">Bronce</SelectItem>
                              <SelectItem value="bg-gray-100 text-gray-800 border-gray-200">Plata</SelectItem>
                              <SelectItem value="bg-yellow-100 text-yellow-800 border-yellow-200">Oro</SelectItem>
                              <SelectItem value="bg-purple-100 text-purple-800 border-purple-200">Platino</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="minPoints">Puntos Mínimos</Label>
                          <Input
                            id="minPoints"
                            type="number"
                            value={formData.minPoints}
                            onChange={(e) => setFormData(prev => ({ ...prev, minPoints: e.target.value }))}
                            placeholder="0"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="maxPoints">Puntos Máximos</Label>
                          <Input
                            id="maxPoints"
                            value={formData.maxPoints}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: e.target.value }))}
                            placeholder="Dejar vacío para ilimitado"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="benefits">Beneficios (separados por comas)</Label>
                        <textarea
                          id="benefits"
                          value={formData.benefits}
                          onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                          placeholder="1 punto por cada $10, Descuento 5%, Envío gratis"
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
                        {editingLevel ? 'Guardar Cambios' : 'Crear Nivel'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {levels.map((level) => (
                <Card key={level.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-16 h-16 ${level.color} opacity-10`}></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getLevelIcon(level.icon.name)}
                        <CardTitle className="text-lg">{level.name}</CardTitle>
                      </div>
                      <Badge className={level.color}>
                        {level.memberCount} miembros
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Rango de puntos:</span>
                        <span className="font-medium">
                          {level.minPoints} - {level.maxPoints === Infinity ? '∞' : level.maxPoints}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Promedio:</span>
                        <span className="font-medium">{level.averagePoints} pts</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Beneficios:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {level.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            {benefit}
                          </li>
                        ))}
                        {level.benefits.length > 3 && (
                          <li className="text-gray-400">+{level.benefits.length - 3} más...</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(level)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(level.id)}
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

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Transacciones de Puntos</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar transacciones..."
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
                <CardTitle>Historial de Transacciones ({filteredTransactions.length})</CardTitle>
                <CardDescription>
              Últimas transacciones de puntos del programa de lealtad
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Cargando transacciones...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Puntos</TableHead>
                        <TableHead>Razón</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.customerName}</div>
                              <div className="text-sm text-gray-500">{transaction.customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTransactionBadge(transaction.type)}
                          </TableCell>
                          <TableCell>
                            <div className={`font-medium ${
                              transaction.type === 'earned' ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                            </div>
                          </TableCell>
                          <TableCell>{transaction.reason}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString('es-ES')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.balance} pts
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
