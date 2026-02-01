import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Zapatillas Running',
    uniqueItems: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Zapatillas diseñadas para correr',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Posición de la categoría en el ordenamiento',
    example: 1,
    default: 0,
  })
  @IsInt()
  @IsOptional()
  position?: number = 0;

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
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
