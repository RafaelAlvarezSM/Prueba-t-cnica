import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from './user-roles.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@tennisstar.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario (será hasheada)',
    example: 'Password123!',
    required: false,
    minLength: 6,
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.ADMIN,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Estado del usuario',
    example: true,
    required: false,
  })
  @IsOptional()
  isActive?: boolean;
}
