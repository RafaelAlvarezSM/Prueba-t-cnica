import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsDecimal } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Subtotal de la orden',
    example: 259.98,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @ApiProperty({
    description: 'Impuestos',
    example: 41.60,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  tax?: number;

  @ApiProperty({
    description: 'Costo de envío',
    example: 10.00,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @ApiProperty({
    description: 'Total de la orden',
    example: 311.58,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  total?: number;

  @ApiProperty({
    description: 'Estado de la orden',
    example: 'PREPARANDO',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Estado del pago',
    example: 'PAGADO',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @ApiProperty({
    description: 'Método de pago',
    example: 'TARJETA_CREDITO',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({
    description: 'Notas de la orden',
    example: 'Entregar después de las 18hs',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
