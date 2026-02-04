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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada exitosamente',
  })
  @ApiResponse({
    status: 409,
    description: 'La categoría ya existe',
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías con conteo de subcategorías' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida exitosamente',
    type: [CategoryResponseDto],
    schema: {
      example: [
        {
          id: 'cuid123456789',
          name: 'Hombre',
          position: 0,
          isPrincipal: true,
          isActive: true,
          parentId: null,
          subcategoriesCount: 2,
          parentCategory: 'Principal',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'cuid987654321',
          name: 'Basketball',
          position: 1,
          isPrincipal: false,
          isActive: true,
          parentId: 'cuid123456789',
          subcategoriesCount: 0,
          parentCategory: 'Hombre',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  findAll(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.findAllWithSubcategoriesCount();
  }

  @Get('roots')
  @ApiOperation({ summary: 'Obtener categorías raíz (para primer selector)' })
  @ApiResponse({
    status: 200,
    description: 'Categorías raíz obtenidas exitosamente',
  })
  findRootCategories() {
    return this.categoriesService.findRootCategories();
  }

  @Get('children/:parentId')
  @ApiOperation({ summary: 'Obtener subcategorías de una categoría padre' })
  @ApiParam({
    name: 'parentId',
    description: 'ID de la categoría padre',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Subcategorías obtenidas exitosamente',
  })
  findChildrenByParent(@Param('parentId') parentId: string) {
    return this.categoriesService.findChildrenByParent(parentId);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Obtener todas las categorías con nombre de padre (para tabla)' })
  @ApiResponse({
    status: 200,
    description: 'Árbol de categorías obtenido exitosamente',
  })
  findAllTree() {
    return this.categoriesService.findAllTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar una categoría (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID de la categoría',
    example: 'cuid123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría desactivada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiResponse({
    status: 409,
    description: 'La categoría tiene productos o subcategorías asociadas',
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
