import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductGender } from './product-gender.enum';
import { ProductOptionDto } from './product-option.dto';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Zapatilla Running Pro',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Zapatilla profesional para running con tecnología de amortiguación avanzada',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Género del producto',
    enum: ProductGender,
    example: ProductGender.HOMBRE,
    required: false,
  })
  @IsEnum(ProductGender)
  @IsOptional()
  gender?: ProductGender;

  @ApiProperty({
    description: 'SKU del producto',
    example: 'TS-RUN-PRO-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 89.99,
    required: false,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
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
    description: 'ID de la marca',
    example: 'cuid987654321',
    required: false,
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty({
    description: 'Estado del producto',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'Opciones del producto (tallas, colores, materiales)',
    type: [ProductOptionDto],
    isArray: true,
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  @IsOptional()
  options?: ProductOptionDto[];
}
