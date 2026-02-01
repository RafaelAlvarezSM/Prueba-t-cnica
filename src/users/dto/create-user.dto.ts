import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from './user-roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@tennisstar.com',
    uniqueItems: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (será hasheada)',
    example: 'Password123!',
    minLength: 6,
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.ADMIN,
    default: UserRole.STAFF,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.STAFF;

  @ApiProperty({
    description: 'Estado del usuario',
    example: true,
    default: true,
  })
  @IsOptional()
  isActive?: boolean = true;
}
