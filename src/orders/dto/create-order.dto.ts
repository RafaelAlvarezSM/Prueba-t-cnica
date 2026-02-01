import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from './order-status.enum';
import { PaymentStatus } from './payment-status.enum';
import { PaymentMethod } from './payment-method.enum';
import { OrderItemDto } from './order-item.dto';
import { ShippingAddressDto } from './shipping-address.dto';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID del cliente',
    example: 'cuid123456789',
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PENDIENTE,
    default: OrderStatus.PENDIENTE,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDIENTE;

  @ApiProperty({
    description: 'Estado del pago',
    enum: PaymentStatus,
    example: PaymentStatus.PENDIENTE,
    default: PaymentStatus.PENDIENTE,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus = PaymentStatus.PENDIENTE;

  @ApiProperty({
    description: 'Método de pago',
    enum: PaymentMethod,
    example: PaymentMethod.TARJETA_CREDITO,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Costo de envío',
    example: 10.99,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  shippingCost?: number = 0;

  @ApiProperty({
    description: 'Impuestos',
    example: 15.50,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  tax?: number = 0;

  @ApiProperty({
    description: 'Notas de la orden',
    example: 'Entregar después de las 18:00',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Items de la orden',
    type: [OrderItemDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Dirección de envío',
    type: ShippingAddressDto,
    required: false,
  })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @IsOptional()
  shippingAddress?: ShippingAddressDto;
}
