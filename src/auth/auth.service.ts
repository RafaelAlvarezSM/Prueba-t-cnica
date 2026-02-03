import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Valida las credenciales de un usuario
   * @param loginDto - Credenciales de acceso (email, password)
   * @returns Información del usuario si las credenciales son válidas
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async login(loginDto: LoginDto) {
    // Búsqueda: Buscar usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
    });

    // Si no existe el usuario, lanzar error genérico para seguridad
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Validación de Password: Comparar contraseña ingresada con hash almacenado
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    // Manejo de Coincidencia
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Si coinciden: Retornar información básica sin el password
    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
