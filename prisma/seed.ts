const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Création des rôles si non existants
  const [adminRole, userRole] = await Promise.all([
    prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin' },
    }),
    prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user' },
    }),
  ]);

  // Hash des mots de passe
  const alicePassword = await bcrypt.hash('alice', 10);
  const bobPassword = await bcrypt.hash('bob', 10);

  // Création des utilisateurs
  await prisma.user.upsert({
    where: { email: 'alice.@admin.com' },
    update: {},
    create: {
      name: 'Alice Dupont',
      email: 'alice.@admin.com',
      password: alicePassword,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'bob.@user.com' },
    update: {},
    create: {
      name: 'Bob Martin',
      email: 'bob.@user.com',
      password: bobPassword,
      roleId: userRole.id,
    },
  });

  console.log('✅ Utilisateurs créés avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });