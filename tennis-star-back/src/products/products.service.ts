import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { parentCategoryName, subCategoryName, options, ...productFields } = createProductDto;

    // Verificar SKU único del producto si se proporciona
    if (productFields.sku) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { sku: productFields.sku },
      });
      
      if (existingProduct) {
        throw new ConflictException(`El SKU '${productFields.sku}' ya está en uso`);
      }
    }

    // Validación Previa: Verificar SKUs duplicados en ProductOption
    if (options && options.length > 0) {
      const skusToCheck: string[] = options
        .map(option => option.sku)
        .filter((sku): sku is string => sku !== undefined && sku !== null && sku !== ''); // Filtrar SKUs no nulos/vacíos

      if (skusToCheck.length > 0) {
        const existingSkus = await this.prisma.productOption.findMany({
          where: {
            sku: {
              in: skusToCheck,
            },
          },
          select: {
            sku: true,
          },
        });

        if (existingSkus.length > 0) {
          const duplicateSkus = existingSkus.map(opt => opt.sku);
          throw new ConflictException(`El SKU ${duplicateSkus[0]} ya está registrado`);
        }
      }
    }

    // Paso 1: Validación de Padre - Buscar categoría raíz por nombre
    const parentCategory = await this.prisma.category.findFirst({
      where: {
        name: parentCategoryName,
        parentId: null, // Debe ser categoría raíz
        isActive: true,
      },
    });

    if (!parentCategory) {
      throw new NotFoundException(`Categoría padre '${parentCategoryName}' no encontrada. Las categorías válidas son: Hombre, Mujer, Niño, Niña`);
    }

    // Paso 2: Gestión de Subcategoría - Upsert usando el índice único
    const subCategory = await this.prisma.category.upsert({
      where: {
        name_parentId: {
          name: subCategoryName,
          parentId: parentCategory.id,
        },
      },
      update: {}, // No actualizamos nada si existe
      create: {
        name: subCategoryName,
        parentId: parentCategory.id,
        position: 1, // Posición para subcategorías
        isActive: true,
      },
    });

    // Paso 3 y 4: Creación del Producto y Opciones en una transacción segura
    const result = await this.prisma.$transaction(async (tx) => {
      try {
        // Crear producto
        const product = await tx.product.create({
          data: {
            name: productFields.name,
            description: productFields.description,
            sku: productFields.sku,
            price: parseFloat(productFields.price.toString()),
            brandName: productFields.brandName,
            categoryId: subCategory.id,
            isActive: productFields.isActive,
          },
        });

        // Crear opciones del producto
        if (options && options.length > 0) {
          await tx.productOption.createMany({
            data: options.map((option) => ({
              productId: product.id,
              size: option.size,
              color: option.color,
              material: option.material,
              sku: option.sku,
              stock: option.stock || 0,
              minStock: option.minStock || 5,
            })),
          });
        }

        return product;
      } catch (error) {
        // Si algo falla, la transacción se revertirá automáticamente
        // incluyendo la subcategoría si fue creada en este mismo momento
        throw error;
      }
    });

    // Retornar producto con jerarquía completa
    return this.findOneWithHierarchy(result.id);
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        options: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        options: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async findAllWithHierarchy() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        options: true,
      },
    });
  }

  async findOneWithHierarchy(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, isActive: true },
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        options: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Verificar que el producto exista
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Si se incluye categoryId, verificar que la categoría exista y no sea raíz
    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }

      if (!category.parentId) {
        throw new BadRequestException('Un producto debe pertenecer a una subcategoría, no a una categoría raíz');
      }
    }

    // Actualizar producto
    const updateData: any = {};
    
    if (updateProductDto.name !== undefined) updateData.name = updateProductDto.name;
    if (updateProductDto.description !== undefined) updateData.description = updateProductDto.description;
    if (updateProductDto.sku !== undefined) updateData.sku = updateProductDto.sku;
    if (updateProductDto.price !== undefined) updateData.price = parseFloat(updateProductDto.price.toString());
    if (updateProductDto.brandName !== undefined) updateData.brandName = updateProductDto.brandName;
    if (updateProductDto.categoryId !== undefined) updateData.categoryId = updateProductDto.categoryId;
    if (updateProductDto.isActive !== undefined) updateData.isActive = updateProductDto.isActive;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          include: {
            parent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        options: true,
      },
    });

    return updatedProduct;
  }

  async remove(id: string) {
    // Verificar que el producto exista
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Soft delete
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateStock(productOptionId: string, quantity: number) {
    const productOption = await this.prisma.productOption.findUnique({
      where: { id: productOptionId },
    });

    if (!productOption) {
      throw new NotFoundException('Opción de producto no encontrada');
    }

    return this.prisma.productOption.update({
      where: { id: productOptionId },
      data: { stock: quantity },
    });
  }
}