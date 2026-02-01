import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { name, sku, categoryId, brandId, options, ...productData } = createProductDto;

    // Verificar si el producto ya existe (por nombre o SKU)
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        OR: [
          { name },
          sku ? { sku } : {},
        ].filter(condition => Object.keys(condition).length > 0),
      },
    });

    if (existingProduct) {
      if (existingProduct.name === name) {
        throw new ConflictException('Ya existe un producto con este nombre');
      }
      if (sku && existingProduct.sku === sku) {
        throw new ConflictException('Ya existe un producto con este SKU');
      }
    }

    // Verificar que la categoría exista
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Verificar que la marca exista
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Marca no encontrada');
    }

    // Crear el producto con sus opciones y stock en una transacción
    const product = await this.prisma.$transaction(async (tx) => {
      // Crear el producto principal
      const newProduct = await tx.product.create({
        data: {
          name,
          sku,
          categoryId,
          brandId,
          ...productData,
        },
      });

      // Crear las opciones del producto y su stock
      const productOptions = await Promise.all(
        options.map(async (option) => {
          // Verificar si el SKU de la opción ya existe
          if (option.sku) {
            const existingOption = await tx.productOption.findUnique({
              where: { sku: option.sku },
            });

            if (existingOption) {
              throw new ConflictException(`Ya existe una opción con el SKU ${option.sku}`);
            }
          }

          // Crear la opción del producto
          const newOption = await tx.productOption.create({
            data: {
              productId: newProduct.id,
              size: option.size,
              color: option.color,
              material: option.material,
              sku: option.sku,
              isActive: option.isActive,
            },
          });

          // Crear el stock para esta opción
          await tx.stock.create({
            data: {
              productId: newProduct.id,
              productOptionId: newOption.id,
              quantity: option.stock || 0,
              minStock: option.minStock || 5,
              isActive: option.isActive,
            },
          });

          return newOption;
        }),
      );

      return {
        ...newProduct,
        options: productOptions,
      };
    });

    // Obtener el producto completo con todas las relaciones
    const completeProduct = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        brand: true,
        options: {
          include: {
            stocks: true,
          },
        },
        stocks: true,
      },
    });

    return completeProduct;
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        options: {
          include: {
            stocks: true,
          },
        },
        stocks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        options: {
          include: {
            stocks: true,
            orderItems: {
              include: {
                order: {
                  select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
        stocks: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { name, sku, categoryId, brandId, options, ...productData } = updateProductDto;

    // Verificar si el producto existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Verificar conflictos de nombre o SKU
    if (name || sku) {
      const conflictProduct = await this.prisma.product.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                name ? { name } : {},
                sku ? { sku } : {},
              ].filter(condition => Object.keys(condition).length > 0),
            },
          ],
        },
      });

      if (conflictProduct) {
        if (conflictProduct.name === name) {
          throw new ConflictException('Ya existe otro producto con este nombre');
        }
        if (sku && conflictProduct.sku === sku) {
          throw new ConflictException('Ya existe otro producto con este SKU');
        }
      }
    }

    // Verificar categoría y marca si se proporcionan
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    if (brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: brandId },
      });

      if (!brand) {
        throw new NotFoundException('Marca no encontrada');
      }
    }

    // Actualizar el producto en una transacción
    const updatedProduct = await this.prisma.$transaction(async (tx) => {
      // Actualizar datos del producto
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          sku,
          categoryId,
          brandId,
          ...productData,
        },
      });

      // Si se proporcionan opciones, actualizarlas
      if (options) {
        // Eliminar opciones existentes y sus stocks
        await tx.stock.deleteMany({
          where: { productId: id },
        });

        await tx.productOption.deleteMany({
          where: { productId: id },
        });

        // Crear nuevas opciones y sus stocks
        const newOptions = await Promise.all(
          options.map(async (option) => {
            const newOption = await tx.productOption.create({
              data: {
                productId: id,
                size: option.size,
                color: option.color,
                material: option.material,
                sku: option.sku,
                isActive: option.isActive,
              },
            });

            await tx.stock.create({
              data: {
                productId: id,
                productOptionId: newOption.id,
                quantity: option.stock || 0,
                minStock: option.minStock || 5,
                isActive: option.isActive,
              },
            });

            return newOption;
          }),
        );

        return { ...product, options: newOptions };
      }

      return product;
    });

    // Obtener el producto completo actualizado
    const completeProduct = await this.prisma.product.findUnique({
      where: { id: updatedProduct.id },
      include: {
        category: true,
        brand: true,
        options: {
          include: {
            stocks: true,
          },
        },
        stocks: true,
      },
    });

    return completeProduct;
  }

  async remove(id: string) {
    // Verificar si el producto existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            stocks: true,
            orderItems: {
              include: {
                order: {
                  select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Verificar que no tenga órdenes asociadas
    if (existingProduct.options.some(option => option.orderItems.length > 0)) {
      throw new ConflictException('No se puede eliminar un producto con órdenes asociadas');
    }

    // Soft delete: desactivar el producto
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Producto desactivado correctamente' };
  }

  async updateStock(productOptionId: string, quantity: number) {
    const stock = await this.prisma.stock.findUnique({
      where: {
        productId_productOptionId: {
          productOptionId,
          productId: (await this.prisma.productOption.findUnique({
            where: { id: productOptionId },
            select: { productId: true },
          }))!.productId,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException('Stock no encontrado para esta opción de producto');
    }

    const updatedStock = await this.prisma.stock.update({
      where: {
        productId_productOptionId: {
          productOptionId,
          productId: stock.productId,
        },
      },
      data: { quantity },
    });

    return updatedStock;
  }
}
