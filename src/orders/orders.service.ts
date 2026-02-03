import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generar una venta directa
   * @param createOrderDto - DTO con los items a vender
   * @returns Orden creada con sus detalles
   */
  async create(createOrderDto: CreateOrderDto) {
    const { items, userId, notes, paymentMethod } = createOrderDto;

    // Validación: debe haber al menos un producto
    if (!items || items.length === 0) {
      throw new Error('Debe seleccionar al menos un producto para realizar la venta');
    }

    // Validación: cada item debe tener datos válidos
    for (const item of items) {
      if (!item.productOptionId) {
        throw new Error('Todos los items deben tener un productOptionId válido');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Todos los items deben tener una cantidad mayor a 0');
      }
      if (!item.price || item.price <= 0) {
        throw new Error('Todos los items deben tener un precio mayor a 0');
      }
    }

    // Generar número de orden único alfanumérico corto
    const orderNumber = this.generateOrderNumber();

    // Calcular total sumando los productos
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Validar que todos los productOptionIds existan
    const productOptionIds = items.map(item => item.productOptionId);
    const existingProductOptions = await this.prisma.productOption.findMany({
      where: {
        id: { in: productOptionIds },
      },
      select: { id: true },
    });

    const existingIds = existingProductOptions.map(po => po.id);
    const missingIds = productOptionIds.filter(id => !existingIds.includes(id));

    if (missingIds.length > 0) {
      throw new NotFoundException(`Los siguientes productOptionIds no existen: ${missingIds.join(', ')}`);
    }

    // Crear orden y sus detalles en una transacción de Prisma
    const result = await this.prisma.$transaction(async (tx) => {
      // Preparar datos de la orden
      const orderData: any = {
        orderNumber,
        total,
        status: 'PENDIENTE',
        paymentMethod: paymentMethod || 'EFECTIVO',
        notes: notes || 'Venta directa',
      };

      // Solo agregar userId si se proporciona (venta opcional con cliente)
      if (userId) {
        // Validar que el userId exista
        const existingUser = await tx.user.findUnique({
          where: { id: userId },
        });
        
        if (!existingUser) {
          throw new NotFoundException(`El userId ${userId} no existe`);
        }
        
        orderData.userId = userId;
      }

      // Crear la orden principal
      const order = await tx.order.create({
        data: orderData,
      });

      // Crear los detalles de la orden (OrderItem)
      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          productOptionId: item.productOptionId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return order;
    });

    // Retornar la orden con sus detalles y nombres de productos
    return this.findOne(result.id);
  }

  /**
   * Listar todas las ventas para el dashboard
   * @returns Lista de ventas con nombres de productos y clientes
   */
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            productOption: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    brandName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Obtener una venta por ID
   * @param id - ID de la orden
   * @returns Orden con detalles completos
   */
  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            productOption: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                    brandName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    return order;
  }

  /**
   * Generar número de orden único alfanumérico corto
   * @returns Número de orden formateado (ej: AB1850E7)
   */
  private generateOrderNumber(): string {
    // Generar código alfanumérico de 8 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getOrdersByStatus(status: string) {
    return this.prisma.order.findMany({
      where: { status: status as any },
      include: {
        items: {
          include: {
            productOption: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
