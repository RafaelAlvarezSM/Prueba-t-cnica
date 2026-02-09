'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye } from "lucide-react";
import { 
  Search, 
  Filter,
  HelpCircle,
  Book,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Video,
  Download,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Settings,
  ShoppingCart,
  CreditCard,
  Package,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data para ayuda y soporte
const mockHelpCategories = [
  {
    id: 1,
    name: 'Guías Rápidas',
    description: 'Tutoriales y guías paso a paso',
    icon: Book,
    color: 'bg-blue-100 text-blue-800',
    articles: 24
  },
  {
    id: 2,
    name: 'Video Tutoriales',
    description: 'Videos explicativos del sistema',
    icon: Video,
    color: 'bg-purple-100 text-purple-800',
    articles: 18
  },
  {
    id: 3,
    name: 'Preguntas Frecuentes',
    description: 'FAQs y respuestas comunes',
    icon: HelpCircle,
    color: 'bg-green-100 text-green-800',
    articles: 45
  },
  {
    id: 4,
    name: 'Soporte Técnico',
    description: 'Ayuda con problemas técnicos',
    icon: Settings,
    color: 'bg-orange-100 text-orange-800',
    articles: 12
  }
];

const mockArticles = [
  {
    id: 1,
    title: 'Cómo crear tu primera venta',
    category: 'Guías Rápidas',
    content: 'Aprende a crear una venta desde cero usando el sistema de Tennis Star...',
    readTime: '5 min',
    difficulty: 'Principiante',
    views: 1256,
    helpful: 89,
    createdAt: '2026-02-01'
  },
  {
    id: 2,
    title: 'Configurar productos y variantes',
    category: 'Guías Rápidas',
    content: 'Guía completa para agregar productos con diferentes tallas y colores...',
    readTime: '8 min',
    difficulty: 'Intermedio',
    views: 892,
    helpful: 76,
    createdAt: '2026-02-02'
  },
  {
    id: 3,
    title: 'Gestionar inventario y stock',
    category: 'Video Tutoriales',
    content: 'Video tutorial sobre cómo mantener tu inventario actualizado...',
    readTime: '12 min',
    difficulty: 'Intermedio',
    views: 567,
    helpful: 92,
    createdAt: '2026-01-28'
  },
  {
    id: 4,
    title: '¿Cómo funciona el programa de lealtad?',
    category: 'Preguntas Frecuentes',
    content: 'Explicación detallada del sistema de puntos y niveles de membresía...',
    readTime: '3 min',
    difficulty: 'Principiante',
    views: 2341,
    helpful: 95,
    createdAt: '2026-01-25'
  },
  {
    id: 5,
    title: 'Solución de problemas de pago',
    category: 'Soporte Técnico',
    content: 'Guía para resolver los problemas más comunes con procesamiento de pagos...',
    readTime: '7 min',
    difficulty: 'Avanzado',
    views: 445,
    helpful: 78,
    createdAt: '2026-01-30'
  }
];

const mockFaqs = [
  {
    id: 1,
    question: '¿Cómo cambio mi contraseña?',
    answer: 'Ve a Configuración > Peril y haz clic en "Cambiar contraseña". Recibirás un email de confirmación.',
    category: 'Cuenta',
    helpful: 156
  },
  {
    id: 2,
    question: '¿Puedo vender productos sin stock?',
    answer: 'Sí, puedes vender productos con stock 0. El sistema te notificará cuando necesites reponer.',
    category: 'Ventas',
    helpful: 89
  },
  {
    id: 3,
    question: '¿Cómo funcionan los descuentos?',
    answer: 'Crea códigos de descuento en la sección Descuentos. Puedes configurar porcentajes, montos fijos y fechas de expiración.',
    category: 'Descuentos',
    helpful: 124
  },
  {
    id: 4,
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito, transferencias bancarias y efectivo en tienda física.',
    category: 'Pagos',
    helpful: 203
  },
  {
    id: 5,
    question: '¿Cómo exporto mis datos?',
    answer: 'Ve a Configuración > Sistema y haz clic en "Exportar datos". Puedes exportar en CSV o Excel.',
    category: 'Datos',
    helpful: 67
  }
];

export default function HelpPage() {
  const { user, isAdmin, isStaff, isCliente } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const filteredArticles = mockArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (selectedCategory && article.category === mockHelpCategories.find(c => c.id === selectedCategory)?.name)
  );

  const filteredFaqs = mockFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      'Principiante': { color: 'bg-green-100 text-green-800' },
      'Intermedio': { color: 'bg-yellow-100 text-yellow-800' },
      'Avanzado': { color: 'bg-red-100 text-red-800' }
    };
    
    const badge = badges[difficulty as keyof typeof badges] || badges['Principiante'];
    
    return (
      <Badge variant="outline" className={badge.color}>
        {difficulty}
      </Badge>
    );
  };

  const getCategoryIcon = (iconName: string) => {
    const icons = {
      Book, Video, HelpCircle, Settings
    };
    const Icon = icons[iconName as keyof typeof icons] || Book;
    return <Icon className="h-6 w-6" />;
  };

  const supportOptions = [
    {
      title: 'Chat en Vivo',
      description: 'Habla con nuestro equipo de soporte',
      icon: MessageSquare,
      action: 'Iniciar Chat',
      available: true,
      waitTime: '~2 min'
    },
    {
      title: 'Email',
      description: 'Envíanos tus preguntas por email',
      icon: Mail,
      action: 'Enviar Email',
      available: true,
      waitTime: '~24h'
    },
    {
      title: 'Teléfono',
      description: 'Llámanos para ayuda inmediata',
      icon: Phone,
      action: 'Llamar Ahora',
      available: true,
      waitTime: '~5 min'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda</h1>
          <p className="text-gray-600">
            Encuentra respuestas, tutoriales y soporte técnico para Tennis Star
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar ayuda, tutoriales, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          {supportOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2">
                    <Button className="w-full">
                      {option.action}
                    </Button>
                    <div className="text-sm text-gray-500">
                      {option.available ? (
                        <span className="flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Disponible · {option.waitTime}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          No disponible
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Categorías de Ayuda</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockHelpCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                      {getCategoryIcon(category.icon.name)}
                    </div>
                    <Badge variant="outline">{category.articles} artículos</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Artículos y Tutoriales
            {selectedCategory && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                - {mockHelpCategories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </h2>
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        {getDifficultyBadge(article.difficulty)}
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views} vistas
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {article.helpful}% útil
                        </span>
                        <span>{new Date(article.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                    <div className="ml-4 space-y-2">
                      <Button variant="outline" size="sm">
                        Leer más
                      </Button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-5 w-5 text-blue-500" />
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          {faq.category}
                        </Badge>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {faq.helpful} personas encontraron útil
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                    <div className="ml-4">
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              ¿No encontraste lo que buscabas?
            </CardTitle>
            <CardDescription>
              Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="font-semibold">Contacto Directo</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>soporte@tennisstar.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>+54 11 1234-5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>Chat disponible 9:00 - 18:00</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Horario de Soporte</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes:</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábados:</span>
                    <span>10:00 - 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingos:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Iniciar Chat de Soporte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
