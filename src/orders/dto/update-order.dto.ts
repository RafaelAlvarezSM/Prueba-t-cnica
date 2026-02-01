import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from './order-status.enum';
import { PaymentStatus } from './payment-status.enum';
import { PaymentMethod } from './payment-method.enum';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PREPARANDO,
    required: false,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'Estado del pago',
    enum: PaymentStatus,
    example: PaymentStatus.PAGADO,
    required: false,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    description: 'Método de pago',
    enum: PaymentMethod,
    example: PaymentMethod.TARJETA_CREDITO,
    required: false,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Costo de envío',
    example: 10.99,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @ApiProperty({
    description: 'Impuestos',
    example: 15.50,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  tax?: number;

  @ApiProperty({
    description: 'Notas de la orden',
    example: 'Entregar después de las 18:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Número de seguimiento',
    example: 'TRK123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;
}
