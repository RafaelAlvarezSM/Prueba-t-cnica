'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Trash2, Plus, Package, Layers, Info, DollarSign, Image as ImageIcon, ChevronRight, Home } from 'lucide-react';
import { productService, CreateProductData, Product, ProductOption } from '@/services/productService';
import api from '@/lib/axios';

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
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
    options: [{ size: '', color: '', material: '', sku: undefined, stock: 0, minStock: 0 }]
  });

  // Función de limpieza estricta de payload para cumplir con DTOs
  const cleanPayload = (data: CreateProductData): any => {
    const isEdit = !!initialData;
    
    if (isEdit) {
      // Para actualización: solo campos permitidos en UpdateProductDto
      const updatePayload: any = {
        name: data.name || undefined,
        description: data.description || undefined,
        sku: data.sku || undefined,
        brandName: data.brandName || undefined,
        price: data.price ? parseFloat(data.price.toString()) : undefined,
        options: data.options?.map(opt => ({
          size: opt.size || undefined,
          color: opt.color || undefined,
          material: opt.material || undefined,
          sku: opt.sku && opt.sku.trim() !== '' ? opt.sku.trim() : undefined, // Convertir vacíos a undefined
          stock: opt.stock !== undefined ? Number(opt.stock) : undefined,
          minStock: opt.minStock !== undefined ? Number(opt.minStock) : undefined
        })).filter(opt => Object.values(opt).some(v => v !== undefined))
      };
      
      // Eliminar campos undefined
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined || (Array.isArray(updatePayload[key]) && updatePayload[key].length === 0)) {
          delete updatePayload[key];
        }
      });
      
      return updatePayload;
    } else {
      // Para creación: campos requeridos en CreateProductDto
      return {
        name: data.name,
        description: data.description || '',
        sku: data.sku || '',
        brandName: data.brandName,
        price: parseFloat(data.price.toString()),
        parentCategoryName: data.parentCategoryName,
        subCategoryName: data.subCategoryName,
        options: data.options.map(opt => ({
          size: opt.size,
          color: opt.color,
          material: opt.material || '',
          sku: opt.sku && opt.sku.trim() !== '' ? opt.sku.trim() : undefined, // Convertir vacíos a undefined
          stock: Number(opt.stock) || 0,
          minStock: Number(opt.minStock) || 5
        })),
        isActive: data.isActive
      };
    }
  };

  // Reactivar queries de categorías padre para el select
  const { data: parentCategories = [] } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => productService.getParentCategories(),
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Modo edición: cargar datos existentes
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          sku: initialData.sku || '',
          brandName: initialData.brandName || '',
          price: initialData.price || 0,
          parentCategoryName: initialData.category?.parent?.name || '',
          subCategoryName: initialData.category?.name || '',
          options: initialData.options && initialData.options.length > 0 
            ? initialData.options.map((opt: ProductOption) => ({
                size: opt.size || '',
                color: opt.color || '',
                material: opt.material || '',
                sku: opt.sku || undefined,
                stock: opt.stock || 0,
                minStock: opt.minStock || 0
              }))
            : [{ size: '', color: '', material: '', sku: undefined, stock: 0, minStock: 0 }],
          isActive: initialData.isActive
        });
      } else {
        // Modo creación: resetear a valores vacíos
        setFormData({
          name: '',
          description: '',
          sku: '',
          brandName: '',
          price: 0,
          parentCategoryName: '',
          subCategoryName: '',
          options: [{ size: '', color: '', material: '', sku: undefined, stock: 0, minStock: 0 }],
          isActive: true
        });
      }
    }
  }, [open, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? { ...option, [field]: value } : option)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = cleanPayload(formData);
    onSubmit(cleanedData);
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { size: '', color: '', material: '', sku: undefined, stock: 0, minStock: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.options.length > 1) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  // Componente de Breadcrumbs dinámico
  const Breadcrumbs = () => {
    const isEdit = !!initialData;
    return (
      <div className="flex items-center text-sm text-slate-500 mb-2">
        <Home className="w-4 h-4 mr-1" />
        <span>Inicio</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span>Productos</span>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="font-medium text-slate-700">{isEdit ? 'Editar' : 'Nuevo'}</span>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-slate-50 p-0 border-none">
        <DialogHeader className="p-6 bg-white border-b sticky top-0 z-10">
          <Breadcrumbs />
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </DialogTitle>
          <p className="text-sm text-slate-500">
            {initialData ? 'Modifica la información del producto y sus variantes.' : 'Completa la información para agregar un nuevo producto al inventario.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg"><Info className="w-4 h-4 text-blue-600"/></div>
              <h3 className="font-semibold text-slate-700">Información Básica del Producto</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm font-medium">Nombre del Producto *</Label>
                <Input placeholder="Ej: Nike Air Max 90" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required className="bg-slate-50/50" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm font-medium">Descripción</Label>
                <Textarea placeholder="Describe las características principales..." value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="bg-slate-50/50 min-h-[100px]" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Género / Categoría Padre *</Label>
                <Select value={formData.parentCategoryName} onValueChange={(v) => {
                  handleInputChange('parentCategoryName', v);
                  handleInputChange('subCategoryName', ''); // Reset subcategory when parent changes
                }}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Selecciona un género" /></SelectTrigger>
                  <SelectContent>{parentCategories.filter(cat => cat && cat.trim() !== '').map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Subcategoría *</Label>
                <Input 
                  placeholder="Ej: Running, Basketball, Casual" 
                  value={formData.subCategoryName} 
                  onChange={(e) => handleInputChange('subCategoryName', e.target.value)}
                  disabled={!formData.parentCategoryName}
                  required 
                  className="bg-slate-50/50" 
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.parentCategoryName ? 
                    `Si existe se usará, si no se creará automáticamente en "${formData.parentCategoryName}"` : 
                    'Primero ingresa la categoría padre'
                  }
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Marca *</Label>
                <Input placeholder="Buscar marca..." value={formData.brandName} onChange={(e) => handleInputChange('brandName', e.target.value)} required className="bg-slate-50/50" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Estado</Label>
                <Select value={formData.isActive?.toString() || 'true'} onValueChange={(v) => handleInputChange('isActive', v === 'true')}>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: PRECIO Y SKU */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-4 h-4 text-green-600"/></div>
              <h3 className="font-semibold text-slate-700">Precio e Identificación</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Precio de Venta ($)</Label>
                <Input type="number" step="0.01" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} className="bg-slate-50/50" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">SKU Base</Label>
                <Input placeholder="Ej: TEN-NIKE-001" value={formData.sku} onChange={(e) => handleInputChange('sku', e.target.value)} className="bg-slate-50/50" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: OPCIONES Y VARIANTES (Diseño Tennis Star) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 rounded-lg"><Layers className="w-4 h-4 text-purple-600"/></div>
                <h3 className="font-semibold text-slate-700">Opciones del Producto</h3>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="text-xs border-dashed hover:bg-blue-50 hover:border-blue-300 transition-colors">
                <Plus className="w-3 h-3 mr-1"/> Agregar Variante
              </Button>
            </div>
            
            <p className="text-xs text-slate-500 mb-4">Define tallas, colores y el stock disponible para cada una.</p>

            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="group relative grid grid-cols-2 md:grid-cols-6 gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-200 transition-all">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Talla</Label>
                    <Input value={option.size} onChange={(e) => handleOptionChange(index, 'size', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Color</Label>
                    <Input value={option.color} onChange={(e) => handleOptionChange(index, 'color', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Material</Label>
                    <Input value={option.material || ''} onChange={(e) => handleOptionChange(index, 'material', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-400 font-bold">SKU Específico</Label>
                    <Input placeholder="SKU único (opcional)" value={option.sku || ''} onChange={(e) => handleOptionChange(index, 'sku', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Stock</Label>
                    <Input type="number" value={option.stock} onChange={(e) => handleOptionChange(index, 'stock', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-400 font-bold">Mínimo</Label>
                    <Input type="number" value={option.minStock} onChange={(e) => handleOptionChange(index, 'minStock', e.target.value)} className="h-8 text-sm" />
                  </div>
                  <div className="flex items-end justify-center pb-1">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)} disabled={formData.options.length === 1} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className={`${
                initialData 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                  : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
              } text-white px-8 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl`}
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {initialData ? 'Actualizando...' : 'Creando...'}
                </span>
              ) : (
                initialData ? 'Guardar Cambios' : 'Crear Producto'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}