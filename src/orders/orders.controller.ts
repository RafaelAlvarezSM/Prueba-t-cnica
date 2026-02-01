import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Stock insuficiente o datos inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente no encontrado',
  })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes obtenida exitosamente',
  })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de órdenes' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
  })
  getStatistics() {
    return this.ordersService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la orden',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una orden' })
  @ApiParam({
    name: 'id',
    description: 'ID de la orden',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req: any,
  ) {
    // El adminId debería venir del usuario autenticado
    const adminId = req.user?.id || 'system';
    return this.ordersService.update(id, updateOrderDto, adminId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar una orden (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la orden',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden cancelada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
