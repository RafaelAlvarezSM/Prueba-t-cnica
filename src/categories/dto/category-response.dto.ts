import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID de la categoría',
    example: 'cuid123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Hombre',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Calzado para hombres',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Posición de la categoría',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Es categoría principal',
    example: true,
  })
  isPrincipal: boolean;

  @ApiProperty({
    description: 'Estado de la categoría',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'ID de la categoría padre',
    example: 'cuid123456789',
    required: false,
  })
  parentId?: string;

  @ApiProperty({
    description: 'Nombre de la categoría padre',
    example: 'Principal',
    required: false,
  })
  parentCategory?: string;

  @ApiProperty({
    description: 'Cantidad de subcategorías',
    example: 3,
  })
  subcategoriesCount: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
