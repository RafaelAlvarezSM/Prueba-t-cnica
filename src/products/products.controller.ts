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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto con opciones y stock' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'El producto ya existe (nombre o SKU duplicado)',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar un producto (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto desactivado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El producto tiene órdenes asociadas',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id/stock/:optionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar stock de una opción de producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    example: 'cuid123456789',
  })
  @ApiParam({
    name: 'optionId',
    description: 'ID de la opción del producto',
    example: 'cuid987654321',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock actualizado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto o opción no encontrada',
  })
  updateStock(
    @Param('id') id: string,
    @Param('optionId') optionId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(optionId, quantity);
  }
}
