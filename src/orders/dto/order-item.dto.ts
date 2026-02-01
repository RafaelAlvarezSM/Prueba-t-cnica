import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class OrderItemDto {
  @ApiProperty({
    description: 'ID de la opción del producto',
    example: 'cuid123456789',
  })
  @IsString()
  productOptionId: string;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Precio unitario al momento de la compra',
    example: 89.99,
  })
  @IsNumber()
  price: number;
}
