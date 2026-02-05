'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart,
  Search,
  Package
} from 'lucide-react';
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
import { orderService, type Product, type ProductOption, type CreateOrderData } from '@/services/orderService';

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: () => void;
}

interface OrderItem {
  id: string;
  productOptionId: string;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export function OrderModal({ open, onOpenChange, onOrderCreated }: OrderModalProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Cargar productos al abrir el modal
  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const productsData = await orderService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar productos');
    } finally {
      setProductsLoading(false);
    }
  };

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const selectedOptionData = selectedProductData?.options.find(o => o.id === selectedOption);

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.16; // 16% IVA
  const total = subtotal + tax;

  const addItemToOrder = () => {
    if (!selectedOptionData || quantity <= 0) return;

    // Verificar stock disponible
    if (quantity > selectedOptionData.stock) {
      setError(`Stock insuficiente. Disponible: ${selectedOptionData.stock}`);
      return;
    }

    // Verificar si ya existe el item
    const existingItemIndex = items.findIndex(item => item.productOptionId === selectedOption);
    
    if (existingItemIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedItems = [...items];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      if (newQuantity > selectedOptionData.stock) {
        setError(`Stock insuficiente. Disponible: ${selectedOptionData.stock}`);
        return;
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity;
      updatedItems[existingItemIndex].subtotal = newQuantity * updatedItems[existingItemIndex].price;
      setItems(updatedItems);
    } else {
      // Agregar nuevo item
      const newItem: OrderItem = {
        id: Date.now().toString(),
        productOptionId: selectedOption,
        productName: selectedProductData!.name,
        productSku: selectedProductData!.sku,
        quantity,
        price: selectedOptionData.price,
        subtotal: quantity * selectedOptionData.price
      };
      setItems([...items, newItem]);
    }

    // Reset form
    setSelectedProduct('');
    setSelectedOption('');
    setQuantity(1);
    setError('');
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const item = items.find(i => i.id === itemId);
    const optionData = selectedProductData?.options.find(o => o.id === item?.productOptionId);
    
    if (optionData && newQuantity > optionData.stock) {
      setError(`Stock insuficiente. Disponible: ${optionData.stock}`);
      return;
    }

    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
    setError('');
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (items.length === 0) {
      setError('Debe agregar al menos un producto a la orden');
      setLoading(false);
      return;
    }

    try {
      const orderData: CreateOrderData = {
        items: items.map(item => ({
          productOptionId: item.productOptionId,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod,
        notes: notes || undefined
      };

      const createdOrder = await orderService.createOrder(orderData);
      
      // Reset y cerrar
      setItems([]);
      setPaymentMethod('');
      setNotes('');
      onOpenChange(false);
      
      console.log('Orden creada exitosamente:', createdOrder);
      
      // Llamar callback para recargar órdenes
      if (onOrderCreated) {
        onOrderCreated();
      }
      
      // Aquí podrías mostrar un toast de éxito
      alert(`Orden ${createdOrder.orderNumber} creada exitosamente`);
    } catch (err: any) {
      console.error('Error creando orden:', err);
      setError(err.response?.data?.message || 'Error al crear la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Venta</DialogTitle>
          <DialogDescription>
            Agrega productos y crea una nueva orden de venta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Selección de Productos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Seleccionar Productos</h3>
            
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {productsLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">Cargando productos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Producto</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent className="max-h-40">
                      {filteredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Variante (Talla/Color)</Label>
                  <Select 
                    value={selectedOption} 
                    onValueChange={setSelectedOption}
                    disabled={!selectedProduct}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona variante" />
                    </SelectTrigger>
                    <SelectContent className="max-h-40">
                      {selectedProductData?.options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          Talla {option.size} - {option.color} - ${option.price} (Stock: {option.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={!selectedOption}
                  />
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button
                    type="button"
                    onClick={addItemToOrder}
                    disabled={!selectedOption || quantity <= 0}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar
                  </Button>
                </div>
              </div>
            )}

            {selectedOptionData && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{selectedProductData?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Talla {selectedOptionData.size} - {selectedOptionData.color}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stock disponible: {selectedOptionData.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${selectedOptionData.price}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: ${(selectedOptionData.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Items de la Orden */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Items de la Orden</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.productSku} - ${item.price} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="font-semibold">${item.subtotal.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Resumen y Métodos de Pago */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resumen de Venta</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (16%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                    <SelectItem value="TARJETA">Tarjeta</SelectItem>
                    <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                    <SelectItem value="MERCADO_PAGO">Mercado Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notas (Opcional)</Label>
                <Input
                  placeholder="Notas adicionales de la venta..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}

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
              disabled={loading || items.length === 0 || !paymentMethod}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando Venta...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Crear Venta (${total.toFixed(2)})
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
