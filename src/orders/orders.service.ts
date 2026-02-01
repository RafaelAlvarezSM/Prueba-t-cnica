import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { 
      customerId, 
      status, 
      paymentStatus, 
      paymentMethod, 
      shippingCost, 
      tax, 
      notes, 
      items, 
      shippingAddress 
    } = createOrderDto;

    // Verificar que el cliente exista
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Verificar que todos los items tengan stock disponible
    const productOptions = await this.prisma.productOption.findMany({
      where: {
        id: { in: items.map(item => item.productOptionId) },
      },
      include: {
        stocks: true,
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
    });

    if (productOptions.length !== items.length) {
      throw new BadRequestException('Algunas opciones de producto no existen');
    }

    // Verificar stock disponible
    for (const item of items) {
      const productOption = productOptions.find(po => po.id === item.productOptionId);
      if (!productOption || !productOption.stocks[0]) {
        throw new BadRequestException(`No hay stock configurado para la opción ${item.productOptionId}`);
      }

      if (productOption.stocks[0].quantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para ${productOption.product.name} - ${productOption.color} - Talla ${productOption.size}. Disponible: ${productOption.stocks[0].quantity}, Solicitado: ${item.quantity}`
        );
      }
    }

    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (shippingCost || 0) + (tax || 0);

    // Generar número de orden único
    const orderNumber = this.generateOrderNumber();

    // Crear la orden en una transacción
    const order = await this.prisma.$transaction(async (tx) => {
      // Crear la orden principal
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          total,
          subtotal,
          tax: tax || 0,
          shippingCost: shippingCost || 0,
          status: status || 'PENDIENTE',
          paymentStatus: paymentStatus || 'PENDIENTE',
          paymentMethod,
          notes,
        },
      });

      // Crear dirección de envío si se proporciona
      if (shippingAddress) {
        await tx.shippingAddress.create({
          data: {
            orderId: newOrder.id,
            address: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country || 'Argentina',
            trackingNumber: shippingAddress.trackingNumber,
          },
        });
      }

      // Crear los items de la orden y actualizar stock
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productOptionId: item.productOptionId,
              quantity: item.quantity,
              price: item.price,
            },
          });

          // Actualizar stock
          const stock = await tx.stock.findUnique({
            where: {
              productId_productOptionId: {
                productOptionId: item.productOptionId,
                productId: productOptions.find(po => po.id === item.productOptionId)!.productId,
              },
            },
          });

          if (stock) {
            await tx.stock.update({
              where: {
                productId_productOptionId: {
                  productOptionId: item.productOptionId,
                  productId: stock.productId,
                },
              },
              data: {
                quantity: stock.quantity - item.quantity,
              },
            });
          }

          return orderItem;
        }),
      );

      // Crear historial inicial
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          status: status || 'PENDIENTE',
          notes: 'Orden creada',
          adminId: 'system', // Esto debería ser el ID del usuario autenticado
        },
      });

      return {
        ...newOrder,
        items: orderItems,
      };
    });

    // Obtener la orden completa con todas las relaciones
    const completeOrder = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        customer: true,
        shippingAddress: true,
        items: {
          include: {
            productOption: {
              include: {
                product: {
                  include: {
                    category: true,
                    brand: true,
                  },
                },
              },
            },
          },
        },
        histories: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return completeOrder;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        customer: true,
        shippingAddress: true,
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
        histories: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        shippingAddress: true,
        items: {
          include: {
            productOption: {
              include: {
                product: {
                  include: {
                    category: true,
                    brand: true,
                  },
                },
                stocks: true,
              },
            },
          },
        },
        histories: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, adminId: string) {
    const { status, paymentStatus, trackingNumber, ...orderData } = updateOrderDto;

    // Verificar si la orden existe
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
      include: {
        shippingAddress: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    // Actualizar la orden en una transacción
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // Actualizar datos de la orden
      const order = await tx.order.update({
        where: { id },
        data: {
          ...orderData,
          status,
          paymentStatus,
        },
      });

      // Actualizar tracking number si se proporciona
      if (trackingNumber && existingOrder.shippingAddress) {
        await tx.shippingAddress.update({
          where: { orderId: id },
          data: { trackingNumber },
        });
      }

      // Crear historial si cambió el estado
      if (status && status !== existingOrder.status) {
        await tx.orderHistory.create({
          data: {
            orderId: id,
            status,
            notes: `Estado cambiado de ${existingOrder.status} a ${status}`,
            adminId,
          },
        });
      }

      return order;
    });

    // Obtener la orden completa actualizada
    const completeOrder = await this.prisma.order.findUnique({
      where: { id: updatedOrder.id },
      include: {
        customer: true,
        shippingAddress: true,
        items: {
          include: {
            productOption: {
              include: {
                product: {
                  include: {
                    category: true,
                    brand: true,
                  },
                },
              },
            },
          },
        },
        histories: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return completeOrder;
  }

  async remove(id: string) {
    // Verificar si la orden existe
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    // Soft delete: cambiar estado a CANCELADO
    await this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });

    return { message: 'Orden cancelada correctamente' };
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TS-${timestamp}-${random}`;
  }

  async getStatistics() {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDIENTE' } }),
      this.prisma.order.count({ where: { status: 'ENTREGADO' } }),
      this.prisma.order.count({ where: { status: 'CANCELADO' } }),
      this.prisma.order.aggregate({
        where: { 
          status: { in: ['ENTREGADO', 'ENVIADO'] },
          paymentStatus: 'PAGADO',
        },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.total || 0,
    };
  }
}
