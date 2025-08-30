import prisma from '../src/lib/prisma';

async function main() {
  try {
    // Import et exécution du script de seed des données
    const seedData = await import('./seedData');
    await seedData.main();

    // Import et exécution du script de configuration de la recherche full-text
    const setupFullTextSearch = await import('./setupFullTextSearch');
    await setupFullTextSearch.setupFullTextSearch();

    console.log('✅ All operations completed successfully');
  } catch (error) {
    console.error('❌ Error during execution:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });