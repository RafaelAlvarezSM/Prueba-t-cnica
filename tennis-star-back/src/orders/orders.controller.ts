import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Generar una venta directa' })
  @ApiResponse({
    status: 201,
    description: 'Venta generada exitosamente',
    schema: {
      example: {
        id: 'cml5rba4i000180uhq6r6cpjh',
        orderNumber: 'AB1850E7',
        total: 389.97,
        status: 'PENDIENTE',
        paymentMethod: 'EFECTIVO',
        notes: 'Venta directa de mostrador',
        createdAt: '2026-02-02T18:00:00.000Z',
        user: {
          id: 'cml5rba2k000080uhaobs3zff',
          name: 'Juan Pérez',
          email: 'juan@example.com',
        },
        items: [
          {
            id: 'cml5rba5j000280uhj1x2k3lm',
            quantity: 3,
            price: 129.99,
            productOption: {
              id: 'cml5l9n100000z0uhf4rczwi8',
              product: {
                id: 'cml5k8m200000z0uhf2x1yabc',
                name: 'Nike Air Max 90',
                sku: 'NKE-AIR90-001',
                brandName: 'Nike',
              },
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos - Debe seleccionar al menos un producto',
  })
  @ApiResponse({
    status: 404,
    description: 'ProductOptionId o UserId no encontrado',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las ventas para el dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ventas con nombres de productos y clientes',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          orderNumber: { type: 'string' },
          total: { type: 'number' },
          status: { type: 'string' },
          paymentMethod: { type: 'string' },
          createdAt: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                quantity: { type: 'number' },
                price: { type: 'number' },
                productOption: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    product: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        sku: { type: 'string' },
                        brandName: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la venta',
    example: 'cml5rba4i000180uhq6r6cpjh',
  })
  @ApiResponse({
    status: 200,
    description: 'Venta encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Venta no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
