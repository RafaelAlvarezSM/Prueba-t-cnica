'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Bell, 
  Settings as SettingsIcon,
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Shield,
  Palette,
  Database,
  Save,
  Upload
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para configuración
const mockSettings = {
  profile: {
    name: 'Admin Tennis Star',
    email: 'admin@tennisstar.com',
    phone: '+54 11 1234-5678',
    avatar: '/api/placeholder/80/80',
    role: 'ADMIN',
    department: 'Sistemas',
    bio: 'Administrador principal del sistema de e-commerce Tennis Star'
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    lowStockAlert: true,
    newOrderAlert: true,
    customerRegistration: false,
    systemUpdates: true,
    marketingEmails: false
  },
  store: {
    name: 'Tennis Star',
    description: 'Tu tienda especializada en calzado deportivo de alta calidad',
    email: 'contacto@tennisstar.com',
    phone: '+54 11 1234-5678',
    address: 'Av. Corrientes 1234',
    city: 'Buenos Aires',
    state: 'CABA',
    postalCode: '1043',
    country: 'Argentina',
    currency: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires',
    logo: '/api/placeholder/120/40',
    favicon: '/api/placeholder/32/32'
  },
  system: {
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    backupFrequency: 'daily',
    maxUploadSize: '10MB',
    sessionTimeout: '24h',
    apiRateLimit: '1000/hour',
    sslEnabled: true
  }
};

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(mockSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async (section: string) => {
    setSaveStatus('saving');
    
    // Simular guardado
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'store', label: 'Tienda', icon: Store },
    { id: 'system', label: 'Sistema', icon: SettingsIcon }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Gestiona la configuración del sistema y tu perfil</p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Foto de Perfil</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Cambiar Foto
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información personal y de contacto
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                          id="name"
                          value={formData.profile.name}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            profile: { ...prev.profile, name: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.profile.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            profile: { ...prev.profile, email: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={formData.profile.phone}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            profile: { ...prev.profile, phone: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="department">Departamento</Label>
                        <Input
                          id="department"
                          value={formData.profile.department}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            profile: { ...prev.profile, department: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={formData.profile.bio}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          profile: { ...prev.profile, bio: e.target.value }
                        }))}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleSave('profile')}
                        disabled={saveStatus === 'saving'}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {saveStatus === 'saving' ? 'Guardando...' : 
                         saveStatus === 'saved' ? '¡Guardado!' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones por Email</CardTitle>
                  <CardDescription>
                    Configura las notificaciones que quieres recibir por email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Notificaciones generales' },
                    { key: 'lowStockAlert', label: 'Alertas de stock bajo' },
                    { key: 'newOrderAlert', label: 'Nuevos pedidos' },
                    { key: 'customerRegistration', label: 'Registro de clientes' },
                    { key: 'systemUpdates', label: 'Actualizaciones del sistema' },
                    { key: 'marketingEmails', label: 'Emails de marketing' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label htmlFor={key} className="flex-1">{label}</Label>
                      <input
                        type="checkbox"
                        id={key}
                        checked={formData.notifications[key as keyof typeof formData.notifications] as boolean}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, [key]: e.target.checked }
                        }))}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Otras Notificaciones</CardTitle>
                  <CardDescription>
                    Configura notificaciones push y SMS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications">Notificaciones Push</Label>
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      checked={formData.notifications.pushNotifications}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, pushNotifications: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsNotifications">Notificaciones SMS</Label>
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={formData.notifications.smsNotifications}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, smsNotifications: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleSave('notifications')}
                      disabled={saveStatus === 'saving'}
                      className="w-full"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saveStatus === 'saving' ? 'Guardando...' : 
                       saveStatus === 'saved' ? '¡Guardado!' : 'Guardar Preferencias'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Store Tab */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Tienda</CardTitle>
                  <CardDescription>
                    Configura los datos básicos de tu tienda
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="storeName">Nombre de la Tienda</Label>
                      <Input
                        id="storeName"
                        value={formData.store.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, name: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="storeEmail">Email de Contacto</Label>
                      <Input
                        id="storeEmail"
                        type="email"
                        value={formData.store.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, email: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="storeDescription">Descripción</Label>
                    <Textarea
                      id="storeDescription"
                      value={formData.store.description}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        store: { ...prev.store, description: e.target.value }
                      }))}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dirección y Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="storePhone">Teléfono</Label>
                      <Input
                        id="storePhone"
                        value={formData.store.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, phone: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="storeAddress">Dirección</Label>
                      <Input
                        id="storeAddress"
                        value={formData.store.address}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, address: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="storeCity">Ciudad</Label>
                      <Input
                        id="storeCity"
                        value={formData.store.city}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, city: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="storeState">Provincia</Label>
                      <Input
                        id="storeState"
                        value={formData.store.state}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, state: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="storePostalCode">Código Postal</Label>
                      <Input
                        id="storePostalCode"
                        value={formData.store.postalCode}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          store: { ...prev.store, postalCode: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="storeCountry">País</Label>
                      <Select value={formData.store.country} onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        store: { ...prev.store, country: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona país" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Argentina">Argentina</SelectItem>
                          <SelectItem value="Brasil">Brasil</SelectItem>
                          <SelectItem value="Chile">Chile</SelectItem>
                          <SelectItem value="Uruguay">Uruguay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="storeCurrency">Moneda</Label>
                      <Select value={formData.store.currency} onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        store: { ...prev.store, currency: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona moneda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARS">ARS - Pesos Argentinos</SelectItem>
                          <SelectItem value="USD">USD - Dólares</SelectItem>
                          <SelectItem value="EUR">EUR - Euros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => handleSave('store')}
                      disabled={saveStatus === 'saving'}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saveStatus === 'saving' ? 'Guardando...' : 
                       saveStatus === 'saved' ? '¡Guardado!' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Sistema</CardTitle>
                  <CardDescription>
                    Ajustes avanzados del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Modo Mantenimiento</Label>
                      <p className="text-sm text-gray-500">Poner la tienda en modo mantenimiento</p>
                    </div>
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={formData.system.maintenanceMode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        system: { ...prev.system, maintenanceMode: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="debugMode">Modo Debug</Label>
                      <p className="text-sm text-gray-500">Activar mensajes de depuración</p>
                    </div>
                    <input
                      type="checkbox"
                      id="debugMode"
                      checked={formData.system.debugMode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        system: { ...prev.system, debugMode: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cacheEnabled">Cache Activado</Label>
                      <p className="text-sm text-gray-500">Habilitar caché del sistema</p>
                    </div>
                    <input
                      type="checkbox"
                      id="cacheEnabled"
                      checked={formData.system.cacheEnabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        system: { ...prev.system, cacheEnabled: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sslEnabled">SSL Habilitado</Label>
                      <p className="text-sm text-gray-500">Forzar conexión HTTPS</p>
                    </div>
                    <input
                      type="checkbox"
                      id="sslEnabled"
                      checked={formData.system.sslEnabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        system: { ...prev.system, sslEnabled: e.target.checked }
                      }))}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Límites y Rendimiento</CardTitle>
                  <CardDescription>
                    Configura límites y ajustes de rendimiento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="backupFrequency">Frecuencia de Backup</Label>
                    <Select value={formData.system.backupFrequency} onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      system: { ...prev.system, backupFrequency: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Cada hora</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="maxUploadSize">Tamaño Máximo de Subida</Label>
                    <Select value={formData.system.maxUploadSize} onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      system: { ...prev.system, maxUploadSize: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tamaño" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5MB">5MB</SelectItem>
                        <SelectItem value="10MB">10MB</SelectItem>
                        <SelectItem value="25MB">25MB</SelectItem>
                        <SelectItem value="50MB">50MB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="sessionTimeout">Tiempo de Sesión</Label>
                    <Select value={formData.system.sessionTimeout} onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      system: { ...prev.system, sessionTimeout: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tiempo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hora</SelectItem>
                        <SelectItem value="8h">8 horas</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="7d">7 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="apiRateLimit">Límite de API</Label>
                    <Select value={formData.system.apiRateLimit} onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      system: { ...prev.system, apiRateLimit: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona límite" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100/hour">100 por hora</SelectItem>
                        <SelectItem value="1000/hour">1000 por hora</SelectItem>
                        <SelectItem value="5000/hour">5000 por hora</SelectItem>
                        <SelectItem value="unlimited">Ilimitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => handleSave('system')}
                      disabled={saveStatus === 'saving'}
                      className="w-full"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saveStatus === 'saving' ? 'Guardando...' : 
                       saveStatus === 'saved' ? '¡Guardado!' : 'Guardar Configuración'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Save Status Indicator */}
        {saveStatus !== 'idle' && (
          <div className="fixed bottom-4 right-4">
            <Card className={`px-4 py-2 ${
              saveStatus === 'saved' ? 'bg-green-50 border-green-200' :
              saveStatus === 'error' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                {saveStatus === 'saved' ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                ) : saveStatus === 'error' ? (
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
                <span className="text-sm font-medium">
                  {saveStatus === 'saved' ? 'Cambios guardados' :
                   saveStatus === 'error' ? 'Error al guardar' :
                   'Guardando cambios...'}
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
