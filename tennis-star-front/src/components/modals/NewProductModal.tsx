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
import { Trash2, Plus, Package, Layers, Info, DollarSign, Image as ImageIcon } from 'lucide-react';
import { productService, CreateProductData, Product } from '@/services/productService';

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
    options: [{ size: '', color: '', material: '', sku: '', stock: 0, minStock: 0 }]
  });

  const { data: parentCategories = [] } = useQuery({
    queryKey: ['parent-categories'],
    queryFn: () => productService.getParentCategories(),
    enabled: open,
  });

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
          options: initialData.options.map(opt => ({
            size: opt.size, color: opt.color, material: opt.material,
            sku: opt.sku, stock: opt.stock, minStock: opt.minStock
          }))
        });
      } else {
        setFormData({
          name: '', description: '', sku: '', brandName: '', price: 0,
          parentCategoryName: '', subCategoryName: '',
          options: [{ size: '', color: '', material: '', sku: '', stock: 0, minStock: 0 }]
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
    const cleanPayload = {
      ...formData,
      price: Number(formData.price),
      options: formData.options.map(opt => ({
        ...opt,
        stock: Number(opt.stock),
        minStock: Number(opt.minStock)
      }))
    };
    onSubmit(cleanPayload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-[#f8fafc] p-0 border-none">
        <DialogHeader className="p-6 bg-white border-b sticky top-0 z-10">
          <DialogTitle className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Producto' : 'Crear Producto'}
          </DialogTitle>
          <p className="text-sm text-slate-500">Completa la información para gestionar tu inventario.</p>
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
                <Label className="text-sm font-medium">Género / Categoría *</Label>
                <Select value={formData.parentCategoryName} onValueChange={(v) => handleInputChange('parentCategoryName', v)}>
                  <SelectTrigger className="bg-slate-50/50"><SelectValue placeholder="Selecciona un género" /></SelectTrigger>
                  <SelectContent>{parentCategories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Marca *</Label>
                <Input placeholder="Buscar marca..." value={formData.brandName} onChange={(e) => handleInputChange('brandName', e.target.value)} required className="bg-slate-50/50" />
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
              <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, options: [...prev.options, { size: '', color: '', material: '', sku: '', stock: 0, minStock: 0 }] }))} className="text-xs border-dashed">
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
                    <Input value={option.material} onChange={(e) => handleOptionChange(index, 'material', e.target.value)} className="h-8 text-sm" />
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
                    <Button type="button" variant="ghost" size="icon" onClick={() => setFormData(prev => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }))} disabled={formData.options.length === 1} className="h-8 w-8 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-500">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-8 rounded-lg shadow-lg shadow-slate-200">
              {loading ? 'Guardando...' : (initialData ? 'Actualizar Producto' : 'Crear Producto con Variantes')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}