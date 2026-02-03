import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductOptionDto {
  @ApiProperty({
    description: 'Talla del producto',
    example: '42',
  })
  @IsString()
  size: string;

  @ApiProperty({
    description: 'Color del producto',
    example: 'Negro',
  })
  @IsString()
  color: string;

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
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Stock mínimo para alerta',
    example: 5,
    default: 5,
  })
  @IsNumber()
  @IsOptional()
  minStock?: number;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Nike Air Max 90',
  })
  @IsString()
  name: string;

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
  })
  @IsString()
  brandName: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 129.99,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Nombre de la categoría padre (Hombre, Mujer, Niño, Niña)',
    example: 'Hombre',
  })
  @IsString()
  parentCategoryName: string;

  @ApiProperty({
    description: 'Nombre de la subcategoría',
    example: 'Running',
  })
  @IsString()
  subCategoryName: string;

  @ApiProperty({
    description: 'Opciones del producto (tallas, colores, stock)',
    type: [ProductOptionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options: ProductOptionDto[];

  @ApiProperty({
    description: 'Estado del producto',
    example: true,
    default: true,
  })
  @IsOptional()
  isActive?: boolean;
}
