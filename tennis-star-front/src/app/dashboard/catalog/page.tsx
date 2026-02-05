'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star,
  SlidersHorizontal,
  Grid,
  List
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for demonstration
const mockProducts = Array.from({ length: 24 }, (_, i) => ({
  id: `PROD-${String(i + 1).padStart(3, '0')}`,
  name: `Nike Air Max ${i + 1}`,
  sku: `NKE-${String(i + 1).padStart(3, '0')}`,
  brand: 'Nike',
  category: 'Running',
  price: (Math.random() * 200 + 50).toFixed(2),
  originalPrice: (Math.random() * 250 + 100).toFixed(2),
  rating: (Math.random() * 2 + 3).toFixed(1),
  reviews: Math.floor(Math.random() * 100) + 1,
  image: `/api/placeholder/300/300`,
  inStock: Math.random() > 0.2,
  isNew: Math.random() > 0.8,
  isSale: Math.random() > 0.7
}));

const categories = [
  { id: 'all', name: 'Todos', count: 156 },
  { id: 'running', name: 'Running', count: 48 },
  { id: 'basketball', name: 'Basketball', count: 32 },
  { id: 'casual', name: 'Casual', count: 28 },
  { id: 'training', name: 'Training', count: 24 },
  { id: 'lifestyle', name: 'Lifestyle', count: 24 }
];

export default function CatalogPage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    let filtered = products;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const ProductCard = ({ product }: { product: typeof mockProducts[0] }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
          <div className="h-32 w-32 bg-muted-foreground/20 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">{product.brand.charAt(0)}</span>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge variant="default" className="text-xs">NUEVO</Badge>
          )}
          {product.isSale && (
            <Badge variant="destructive" className="text-xs">OFERTA</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock indicator */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
            <Badge variant="destructive">AGOTADO</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">${product.price}</span>
                {product.isSale && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button 
            className="w-full mt-2" 
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
        <p className="text-muted-foreground">
          Explora nuestra colección completa de tenis y calzado deportivo
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6">
        {/* Categories Sidebar */}
        <div className="w-64 hidden lg:block">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredProducts.length} de {products.length} productos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    No se encontraron productos que coincidan con tu búsqueda.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
