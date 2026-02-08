import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL no está definida en las variables de entorno');
  process.exit(1);
}

console.log('🔗 Conectando a la base de datos...');

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seeder de categorías y subcategorías...');
  
  try {
    await prisma.$connect();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    throw error;
  }

  // Definición de estructura: Raíz -> Subcategorías
  const categoriesStructure = {
    'Hombre': ['Calzado', 'Ropa', 'Accesorios', 'Raquetas'],
    'Mujer': ['Calzado', 'Ropa', 'Accesorios', 'Raquetas'],
    'Niño': ['Calzado', 'Ropa', 'Raquetas'],
    'Niña': ['Calzado', 'Ropa', 'Raquetas']
  };

  for (const [rootName, subCategories] of Object.entries(categoriesStructure)) {
    
    // --- 1. PROCESAR CATEGORÍA RAÍZ ---
    let rootCategory = await prisma.category.findFirst({
      where: { name: rootName, parentId: null }
    });

    if (!rootCategory) {
      rootCategory = await prisma.category.create({
        data: { 
          name: rootName, 
          position: 0,
          description: `Categoría principal para ${rootName.toLowerCase()}`
        }
      });
      console.log(`✅ Categoría raíz creada: ${rootName}`);
    } else {
      console.log(`ℹ️ La raíz ${rootName} ya existe.`);
    }

    // --- 2. PROCESAR SUBCATEGORÍAS ---
    for (const subName of subCategories) {
      const existingSub = await prisma.category.findFirst({
        where: { 
          name: subName,
          parentId: rootCategory.id 
        }
      });

      if (!existingSub) {
        await prisma.category.create({
          data: {
            name: subName,
            parentId: rootCategory.id,
            position: 1,
            description: `${subName} para la sección de ${rootName}`
          }
        });
        console.log(`   └─ ✅ Subcategoría creada: ${subName}`);
      } else {
        console.log(`   └─ ℹ️ La subcategoría ${subName} ya existe.`);
      }
    }
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