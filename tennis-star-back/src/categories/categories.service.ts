import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const { parentId, ...categoryData } = createCategoryDto;

    // Verificar si el nombre ya existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: categoryData.name },
    });

    if (existingCategory) {
      throw new ConflictException('El nombre de la categoría ya existe');
    }

    // Si hay parentId, verificar que exista
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Categoría padre no encontrada');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        ...categoryData,
        parentId: parentId || null,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    return this.formatCategoryResponse(category);
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories.map(category => this.formatCategoryResponse(category));
  }

  async findAllWithSubcategoriesCount(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories.map(category => this.formatCategoryResponse(category));
  }

  async findRootCategories() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        position: true,
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findChildrenByParent(parentId: string) {
    return this.prisma.category.findMany({
      where: {
        parentId: parentId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        position: true,
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findAllTree() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      position: category.position,
      parentName: category.parent?.name || 'Sin categoría padre',
      parentId: category.parentId,
      isRoot: !category.parentId,
    }));
  }

  async findPrincipalCategories() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: [
            { position: 'asc' },
            { name: 'asc' },
          ],
        },
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                children: true,
              },
            },
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return this.formatCategoryResponse(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { parentId, ...categoryData } = updateCategoryDto;

    // Verificar si la categoría existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Si se actualiza el nombre, verificar que no exista
    if (categoryData.name && categoryData.name !== existingCategory.name) {
      const nameExists = await this.prisma.category.findUnique({
        where: { name: categoryData.name },
      });

      if (nameExists) {
        throw new ConflictException('El nombre de la categoría ya existe');
      }
    }

    // Si hay parentId, verificar que exista y no sea la misma categoría
    if (parentId) {
      if (parentId === id) {
        throw new ConflictException('Una categoría no puede ser su propia padre');
      }

      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException('Categoría padre no encontrada');
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...categoryData,
        parentId: parentId !== undefined ? parentId : existingCategory.parentId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    return this.formatCategoryResponse(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            children: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Verificar que no tenga productos o subcategorías activas
    if (category._count.children > 0 || category._count.products > 0) {
      throw new ConflictException(
        'No se puede desactivar la categoría porque tiene productos o subcategorías asociadas'
      );
    }

    // Soft delete
    await this.prisma.category.delete({where: { id } });

    return { message: 'Categoría eliminada exitosamente' };
  }

  private formatCategoryResponse(category: any): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      position: category.position,
      isPrincipal: !category.parentId,
      isActive: category.isActive,
      parentId: category.parentId,
      parentCategory: category.parent?.name || null,
      subcategoriesCount: category._count?.children || 0,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
