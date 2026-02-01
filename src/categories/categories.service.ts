import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name, parentId, ...categoryData } = createCategoryDto;

    // Verificar si la categoría ya existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      throw new ConflictException('La categoría con este nombre ya existe');
    }

    // Si se proporciona parentId, verificar que exista
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
        name,
        parentId,
        ...categoryData,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async findTree() {
    // Obtener todas las categorías ordenadas
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: [
        { position: 'asc' },
        { name: 'asc' },
      ],
    });

    // Construir árbol jerárquico
    const buildTree = (categories: any[], parentId: string | null = null): any[] => {
      return categories
        .filter(category => category.parentId === parentId)
        .map(category => ({
          ...category,
          children: buildTree(categories, category.id),
        }));
    };

    return buildTree(categories);
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          include: {
            brand: true,
            options: true,
          },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
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

    // Si se proporciona parentId, verificar que exista y no sea la misma categoría
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

      // Verificar que no se cree un ciclo infinito
      const isDescendant = await this.isDescendant(parentId, id);
      if (isDescendant) {
        throw new ConflictException('No se puede establecer como padre a una categoría descendiente');
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        parentId,
        ...categoryData,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    return updatedCategory;
  }

  async remove(id: string) {
    // Verificar si la categoría existe
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    // Verificar que no tenga categorías hijas
    if (existingCategory.children.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría con subcategorías');
    }

    // Verificar que no tenga productos asociados
    if (existingCategory.products.length > 0) {
      throw new ConflictException('No se puede eliminar una categoría con productos asociados');
    }

    // Soft delete: desactivar la categoría
    await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Categoría desactivada correctamente' };
  }

  private async isDescendant(ancestorId: string, categoryId: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { parent: true },
    });

    if (!category || !category.parentId) {
      return false;
    }

    if (category.parentId === ancestorId) {
      return true;
    }

    return this.isDescendant(ancestorId, category.parentId);
  }
}
