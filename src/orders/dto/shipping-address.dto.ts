import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ShippingAddressDto {
  @ApiProperty({
    description: 'Dirección de envío',
    example: 'Av. Corrientes 1234',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Buenos Aires',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Provincia/Estado',
    example: 'Buenos Aires',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'Código postal',
    example: '1041',
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    description: 'País',
    example: 'Argentina',
    default: 'Argentina',
  })
  @IsString()
  @IsOptional()
  country?: string = 'Argentina';

  @ApiProperty({
    description: 'Número de seguimiento',
    example: 'TRK123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;
}
