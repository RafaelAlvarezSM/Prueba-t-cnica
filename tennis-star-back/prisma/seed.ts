import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar que DATABASE_URL exista
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL no está definida en las variables de entorno');
  process.exit(1);
}

console.log('🔗 Conectando a la base de datos...');
console.log('📍 DATABASE_URL:', databaseUrl.replace(/:([^:@]+)@/, ':***@')); // Oculta contraseña

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seeder de categorías raíz...');
  
  try {
    // Probar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    throw error;
  }

  const roots = ['Hombre', 'Mujer', 'Niño', 'Niña'];
  
  for (const name of roots) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { 
        name, 
        position: 0,
        description: `Categoría principal para ${name.toLowerCase()}`
      }
    });
    console.log(`✅ Categoría raíz creada: ${name}`);
  }

  console.log('🎉 Seeder completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
