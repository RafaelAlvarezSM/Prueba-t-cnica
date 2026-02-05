import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto, UserRole } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

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

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    // Si coinciden: Retornar información básica sin el password
    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token
    };
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param registerDto - Datos del nuevo usuario
   * @returns Usuario creado y token de acceso
   */
  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear usuario
    const newUser = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role as any, // Cast temporal hasta que Prisma genere los tipos
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Generar token JWT
    const token = this.jwtService.sign({
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    return {
      message: 'Usuario creado exitosamente',
      user: newUser,
      token
    };
  }

  /**
   * Obtiene el perfil de un usuario por su ID
   * @param userId - ID del usuario
   * @returns Información del perfil del usuario
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }
}
