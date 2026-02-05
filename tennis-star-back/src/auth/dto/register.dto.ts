import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Definir el enum localmente ya que Prisma está en una ruta personalizada
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CLIENTE = 'CLIENTE'
}

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.STAFF,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
