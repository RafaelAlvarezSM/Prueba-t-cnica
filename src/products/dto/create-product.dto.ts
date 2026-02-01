import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, IsArray, ValidateNested, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductGender } from './product-gender.enum';
import { ProductOptionDto } from './product-option.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Zapatilla Running Pro',
  })
  @IsString()
  name: string;

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
  })
  @IsEnum(ProductGender)
  gender: ProductGender;

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
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @ApiProperty({
    description: 'ID de la categoría',
    example: 'cuid123456789',
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'ID de la marca',
    example: 'cuid987654321',
  })
  @IsString()
  brandId: string;

  @ApiProperty({
    description: 'Estado del producto',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Opciones del producto (tallas, colores, materiales)',
    type: [ProductOptionDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionDto)
  options: ProductOptionDto[];
}
