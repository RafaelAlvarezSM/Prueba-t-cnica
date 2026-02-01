import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

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
    description: 'SKU único para esta opción',
    example: 'TS-RUN-42-NEGRO',
    required: false,
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Cantidad inicial en stock',
    example: 10,
  })
  @IsOptional()
  stock?: number = 0;

  @ApiProperty({
    description: 'Stock mínimo para alerta',
    example: 5,
  })
  @IsOptional()
  minStock?: number = 5;

  @ApiProperty({
    description: 'Estado de la opción',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
