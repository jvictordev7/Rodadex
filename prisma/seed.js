import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de exemplo
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@rodadex.com' },
    update: {},
    create: {
      name: 'Administrador Rodadex',
      email: 'admin@rodadex.com',
      passwordHash: hashedPassword,
      provider: 'CREDENTIALS',
    },
  });

  console.log('👤 Usuário criado:', user);

  // Criar alguns times favoritos de exemplo
  const favorite1 = await prisma.favorite.upsert({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: 40, // Inter de Milão
      }
    },
    update: {},
    create: {
      userId: user.id,
      teamId: 40,
      teamName: 'Inter de Milão',
      teamLogo: 'https://media.api-sports.io/football/teams/40.png',
    },
  });

  const favorite2 = await prisma.favorite.upsert({
    where: {
      userId_teamId: {
        userId: user.id,
        teamId: 85, // Paris Saint Germain
      }
    },
    update: {},
    create: {
      userId: user.id,
      teamId: 85,
      teamName: 'Paris Saint Germain',
      teamLogo: 'https://media.api-sports.io/football/teams/85.png',
    },
  });

  console.log('⭐ Favoritos criados:', { favorite1, favorite2 });
  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });