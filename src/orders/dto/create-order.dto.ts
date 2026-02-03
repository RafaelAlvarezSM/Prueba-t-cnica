import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNumber, IsPositive, IsUUID, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID de la variante del producto (talla/color específica) - OBLIGATORIO',
    example: 'cml5l9n100000z0uhf4rczwi8',
  })
  @IsString()
  productOptionId: string;

  @ApiProperty({
    description: 'Cantidad de esta variante del producto - OBLIGATORIO',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario de esta variante - OBLIGATORIO',
    example: 129.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array de productos a vender - DEBE CONTENER AL MENOS UN PRODUCTO',
    type: [OrderItemDto],
    isArray: true,
    minItems: 1,
    example: [
      {
        "productOptionId": "cml5l9n100000z0uhf4rczwi8",
        "quantity": 2,
        "price": 129.99
      }
    ]
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'ID del usuario (opcional para ventas rápidas)',
    example: 'cml5rba2k000080uhaobs3zff',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Método de pago',
    example: 'EFECTIVO',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    description: 'Notas de la venta',
    example: 'Venta directa de mostrador',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // Ejemplo completo para referencia
  static example() {
    return {
      items: [
        {
          productOptionId: "cml5l9n100000z0uhf4rczwi8",
          quantity: 2,
          price: 129.99
        }
      ],
      userId: "cml5rba2k000080uhaobs3zff",
      paymentMethod: "EFECTIVO",
      notes: "Venta directa de mostrador"
    };
  }
}
