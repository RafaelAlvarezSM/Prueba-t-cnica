'use client';

import { useState } from 'react';
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
import { X } from 'lucide-react';

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
}

export interface CategoryFormData {
  name: string;
  parentCategory: string;
  position: string;
}

export default function CategoryModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: CategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    parentCategory: initialData?.parentCategory || '',
    position: initialData?.position || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    
    // Reset form after successful submission
    if (!initialData) {
      setFormData({
        name: '',
        parentCategory: '',
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
              <Label htmlFor="parentCategory">Categoría Padre</Label>
              <Select 
                value={formData.parentCategory || 'none'} 
                onValueChange={(value) => handleInputChange('parentCategory', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Principal (sin padre)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Principal (sin padre)</SelectItem>
                  <SelectItem value="Hombre">Hombre</SelectItem>
                  <SelectItem value="Mujer">Mujer</SelectItem>
                  <SelectItem value="Niño">Niño</SelectItem>
                  <SelectItem value="Niña">Niña</SelectItem>
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
            >
              {initialData ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
