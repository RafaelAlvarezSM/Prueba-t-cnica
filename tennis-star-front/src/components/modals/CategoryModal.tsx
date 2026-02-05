'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for parent categories
const parentCategories = [
  { id: '1', name: 'Hombre' },
  { id: '2', name: 'Mujer' },
  { id: '3', name: 'Niño' },
  { id: '4', name: 'Niña' },
];

export function CategoryModal({ open, onOpenChange }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    parentCategoryId: '',
    position: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aquí iría la llamada a la API
      console.log('Creating category:', formData);
      
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setFormData({
        name: '',
        parentCategoryId: '',
        position: 1
      });
      onOpenChange(false);
      
      // Mostrar éxito (podría usar un toast)
      console.log('Categoría creada exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nueva Categoría</DialogTitle>
          <DialogDescription>
            Crea una nueva categoría para organizar tus productos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Categoría</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: Running, Basketball, Casual"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Nombre descriptivo para la categoría
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentCategoryId">Categoría Padre</Label>
            <Select
              value={formData.parentCategoryId}
              onValueChange={(value) => handleInputChange('parentCategoryId', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría padre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="principal">Principal (Sin padre)</SelectItem>
                {parentCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Si seleccionas "Principal", será una categoría raíz
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Posición</Label>
            <Input
              id="position"
              type="number"
              min="1"
              placeholder="1"
              value={formData.position}
              onChange={(e) => handleInputChange('position', parseInt(e.target.value) || 1)}
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Orden de aparición en el menú (1 aparece primero)
            </p>
          </div>

          {/* Preview */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Vista Previa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">
                  {formData.name || 'Nombre de la categoría'}
                </span>
              </div>
              {formData.parentCategoryId && formData.parentCategoryId !== 'principal' && (
                <div className="flex items-center gap-2 ml-4">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span className="text-sm text-muted-foreground">
                    Subcategoría de: {parentCategories.find(c => c.id === formData.parentCategoryId)?.name}
                  </span>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Posición: {formData.position}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Categoría'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
