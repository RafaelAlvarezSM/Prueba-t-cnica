import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones del frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Tennis Star API')
    .setDescription('Documentación de la API para el panel administrativo de Tennis Star')
    .setVersion('1.0')
    .addBearerAuth() // Esto es clave para el JWT que mencionaste
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Ruta donde se verá la documentación: http://localhost:3001/api
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,       // Elimina campos que no estén en el DTO
  forbidNonWhitelisted: true, // Lanza error si mandan campos extra
  transform: true,       // Convierte tipos automáticamente (ej: string a number)
}));

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Servidor corriendo en el puerto ${process.env.PORT ?? 3001}`);
  console.log(`Swagger disponible en: http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
