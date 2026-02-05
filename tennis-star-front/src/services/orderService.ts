import api from '@/lib/axios';

export interface OrderItem {
  productOptionId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  paymentMethod: string;
  notes?: string;
  userId?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  histories: OrderHistory[];
}

export interface OrderHistory {
  id: string;
  status: string;
  notes: string;
  createdAt: string;
  admin: {
    name: string;
  };
}

export interface ProductOption {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  product: {
    id: string;
    name: string;
    sku: string;
    brandName: string;
  };
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  brandName: string;
  options: ProductOption[];
}

class OrderService {
  // Obtener todas las órdenes
  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  }

  // Obtener una orden por ID
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  // Crear una nueva orden
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', orderData);
    return response.data;
  }

  // Actualizar estado de una orden
  async updateOrderStatus(id: string, status: string, notes?: string): Promise<Order> {
    const response = await api.patch(`/orders/${id}/status`, { status, notes });
    return response.data;
  }

  // Eliminar una orden
  async deleteOrder(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  }

  // Obtener productos para el selector de órdenes
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  }

  // Obtener opciones de producto por ID
  async getProductOptions(productId: string): Promise<ProductOption[]> {
    const response = await api.get(`/products/${productId}/options`);
    return response.data;
  }

  // Buscar productos
  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get(`/products?search=${query}`);
    return response.data;
  }
}

export const orderService = new OrderService();
