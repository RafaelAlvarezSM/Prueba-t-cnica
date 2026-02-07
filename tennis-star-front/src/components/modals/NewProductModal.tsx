'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  X, 
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { productService } from '@/services/productService';
import { CreateProductData, Product, ProductOption } from '@/services/productService';

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductData) => void;
  initialData?: Product;
  loading?: boolean;
}

export default function NewProductModal({ 
  open, 
  onOpenChange,
  onSubmit,
  initialData,
  loading = false
}: NewProductModalProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    name: '',
    description: '',
    sku: '',
    brandName: '',
    price: 0,
    parentCategoryName: '',
    subCategoryName: '',
    options: [
      {
        size: '',
        color: '',
        material: '',
        sku: '',
        stock: 0,
        minStock: 0
      }
    ]
  });

  // Query para obtener categorías principales
  const { data: parentCategories = [], isLoading: parentCategoriesLoading } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => productService.getParentCategories(),
    enabled: open,
  });

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          sku: initialData.sku || '',
          brandName: initialData.brandName || '',
          price: initialData.price || 0,
          parentCategoryName: initialData.parentCategoryName || '',
          subCategoryName: initialData.subCategoryName || '',
          options: initialData.options.length > 0 ? initialData.options : [
            {
              size: '',
              color: '',
              material: '',
              sku: '',
              stock: 0,
              minStock: 0
            }
          ]
        });
      } else {
        setFormData({
          name: '',
          description: '',
          sku: '',
          brandName: '',
          price: 0,
          parentCategoryName: '',
          subCategoryName: '',
          options: [
            {
              size: '',
              color: '',
              material: '',
              sku: '',
              stock: 0,
              minStock: 0
            }
          ]
        });
      }
    }
  }, [open, initialData]);

  const handleInputChange = (field: keyof CreateProductData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, field: keyof ProductOption, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const addOption = () => {
    const newOption: ProductOption = {
      size: '',
      color: '',
      material: '',
      sku: '',
      stock: 0,
      minStock: 0
    };
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filtrar opciones vacías
    const validOptions = formData.options.filter(option => 
      option.size || option.color || option.material || option.sku
    );
    
    const finalData = {
      ...formData,
      options: validOptions.length > 0 ? validOptions : [{
        size: '',
        color: '',
        material: '',
        sku: '',
        stock: 0,
        minStock: 0
      }]
    };
    
    console.log('Enviando datos al backend:', finalData);
    onSubmit(finalData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {initialData ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-6">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Nombre del Producto</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Nike Air Max 90"
                    required
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-700">SKU</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Ej: NIKE-AIR-MAX-90"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-700">Descripción</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe las características del producto..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Marca</Label>
                  <Input
                    value={formData.brandName}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                    placeholder="Ej: Nike"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Categoría Principal</Label>
                  <Select 
                    value={formData.parentCategoryName} 
                    onValueChange={(value) => handleInputChange('parentCategoryName', value)}
                    disabled={parentCategoriesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Category Name</Label>
                  <Input
                    value={formData.subCategoryName}
                    onChange={(e) => handleInputChange('subCategoryName', e.target.value)}
                    placeholder="Ej: Tenis de Carrera"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <Label className="text-sm font-medium text-slate-700">Precio</Label>
                <Input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Opciones del Producto */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Opciones del Producto</h3>
                <Button type="button" variant="outline" onClick={addOption}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Variante
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.options.map((option, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-900">Variante {index + 1}</h4>
                      {formData.options.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Talla</Label>
                        <Input
                          value={option.size}
                          onChange={(e) => handleOptionChange(index, 'size', e.target.value)}
                          placeholder="Ej: 40, 41, 42"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Color</Label>
                        <Input
                          value={option.color}
                          onChange={(e) => handleOptionChange(index, 'color', e.target.value)}
                          placeholder="Ej: Negro, Blanco, Azul"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Material</Label>
                        <Input
                          value={option.material}
                          onChange={(e) => handleOptionChange(index, 'material', e.target.value)}
                          placeholder="Ej: Cuero, Sintético, Malla"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-700">SKU de Variante</Label>
                        <Input
                          value={option.sku}
                          onChange={(e) => handleOptionChange(index, 'sku', e.target.value)}
                          placeholder="SKU único para esta variante"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Stock</Label>
                        <Input
                          type="text"
                          value={option.stock}
                          onChange={(e) => handleOptionChange(index, 'stock', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-700">Stock Mínimo</Label>
                        <Input
                          type="text"
                          value={option.minStock}
                          onChange={(e) => handleOptionChange(index, 'minStock', e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pie del Modal */}
          <div className="border-t pt-4 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {initialData ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  {initialData ? 'Guardar Cambios' : 'Crear Producto con Variantes'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
