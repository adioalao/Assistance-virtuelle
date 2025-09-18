import prisma from '../src/lib/prisma';

export async function setupFullTextSearch() {
   try {
      // 1️⃣ Activer les extensions nécessaires
      await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS unaccent`);
      await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);

      // 2️⃣ Vérifier si la colonne existe déjà
      const columnExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name='Question'
          AND column_name='question_tsv'
      )
    `;

      if (!columnExists[0].exists) {
         await prisma.$executeRawUnsafe(`
        ALTER TABLE "Question" ADD COLUMN question_tsv tsvector;
      `);
      }

      // 3️⃣ Recalculer la colonne avec UNACCENT
      await prisma.$executeRawUnsafe(`
      UPDATE "Question" SET question_tsv = to_tsvector('french', unaccent(content));
    `);

      // 4️⃣ Créer l’index GIN pour FTS si absent
      const indexExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename='Question'
          AND indexname='idx_question_tsv'
      )
    `;

      if (!indexExists[0].exists) {
         await prisma.$executeRawUnsafe(`
        CREATE INDEX idx_question_tsv ON "Question" USING GIN(question_tsv);
      `);
      }

      // 5️⃣ Créer l’index trigram (pour la recherche fuzzy)
      const trgmIndexExists = await prisma.$queryRaw<{ exists: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename='Question'
          AND indexname='idx_question_trgm'
      )
    `;

      if (!trgmIndexExists[0].exists) {
         await prisma.$executeRawUnsafe(`
        CREATE INDEX idx_question_trgm ON "Question" USING GIN (content gin_trgm_ops);
      `);
      }

      // 6️⃣ Créer ou remplacer la fonction du trigger (avec UNACCENT)
      await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION question_tsv_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.question_tsv := to_tsvector('french', unaccent(NEW.content));
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

      // 7️⃣ Créer le trigger (supprime l'existant si nécessaire)
      await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS tsv_question_update ON "Question";
    `);
      await prisma.$executeRawUnsafe(`
      CREATE TRIGGER tsv_question_update
      BEFORE INSERT OR UPDATE ON "Question"
      FOR EACH ROW EXECUTE FUNCTION question_tsv_trigger();
    `);

      console.log('✅ Full-text + trigram search setup completed');
   } catch (err) {
      console.error('❌ Error setting up full-text search:', err);
      throw err;
   }
}