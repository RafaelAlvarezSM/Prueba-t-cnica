import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Hombre',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Calzado para hombres',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Posición de la categoría en el listado',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  position?: number;

  @ApiProperty({
    description: 'ID de la categoría padre (para jerarquía)',
    example: 'cuid123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: 'Estado de la categoría',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
