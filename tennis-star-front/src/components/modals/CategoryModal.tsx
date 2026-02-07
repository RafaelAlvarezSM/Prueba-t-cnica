'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Loader2 } from 'lucide-react';
import { categoryService } from '@/services/categoryService';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
  loading?: boolean;
}

export interface CategoryFormData {
  name: string;
  parentId: string;
  position: string;
}

export default function CategoryModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  loading = false
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    parentId: initialData?.parentId || '',
    position: initialData?.position || ''
  });

  // Query para obtener categorías principales (para el selector de padre)
  const { data: parentCategories = [], isLoading: parentCategoriesLoading } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => categoryService.getParentCategories(),
    enabled: open, // Solo cargar cuando el modal está abierto
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form after successful submission
    if (!initialData) {
      setFormData({
        name: '',
        parentId: '',
        position: ''
      });
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            {initialData 
              ? 'Modifica los datos de la categoría existente.'
              : 'Crea una nueva categoría para organizar tus productos.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full"
                required
              />
            </div>

            {/* Categoría Padre */}
            <div className="grid gap-2">
              <Label htmlFor="parentId">Categoría Padre</Label>
              <Select 
                value={formData.parentId || 'none'} 
                onValueChange={(value) => handleInputChange('parentId', value === 'none' ? '' : value)}
                disabled={parentCategoriesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Principal (sin padre)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Principal (sin padre)</SelectItem>
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Posición */}
            <div className="grid gap-2">
              <Label htmlFor="position">Posición</Label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="1"
                className="w-full"
                min="1"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end">
            <Button 
              type="submit" 
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                initialData ? 'Guardar Cambios' : 'Crear'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
