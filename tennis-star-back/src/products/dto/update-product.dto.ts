import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductOptionDto {
  @ApiProperty({
    description: 'Talla del producto',
    example: '42',
    required: false,
  })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({
    description: 'Color del producto',
    example: 'Negro',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Material del producto',
    example: 'Cuero',
    required: false,
  })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({
    description: 'SKU de la opción',
    example: 'TS-BK-42',
    required: false,
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Cantidad en stock',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Stock mínimo para alerta',
    example: 5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  minStock?: number;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Nike Air Max 90',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Zapatillas clásicas con tecnología Air',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'SKU del producto',
    example: 'TS-NIKE-AM90',
    required: false,
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Nombre de la marca',
    example: 'Nike',
    required: false,
  })
  @IsString()
  @IsOptional()
  brandName?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 129.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 'cuid123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Estado del producto',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Opciones del producto (tallas, colores, stock)',
    type: [ProductOptionDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options?: ProductOptionDto[];
}
