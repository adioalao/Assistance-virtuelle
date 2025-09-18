import prisma from '../src/lib/prisma';

export async function setupFullTextSearch() {
   try {
      // 1️⃣ Vérifier la colonne
      const columnExists = await prisma.$queryRaw<
         { exists: boolean }[]
      >`SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name='Question'
        AND column_name='question_tsv'
    )`;

      if (!columnExists[0].exists) {
         await prisma.$executeRawUnsafe(`
        ALTER TABLE "Question" ADD COLUMN question_tsv tsvector;
      `);
      }

      // 2️⃣ Remplir la colonne
      await prisma.$executeRawUnsafe(`
      UPDATE "Question" SET question_tsv = to_tsvector('french', content);
    `);

      // 3️⃣ Vérifier si l'index existe
      const indexExists = await prisma.$queryRaw<{ exists: boolean }[]>
         `SELECT EXISTS (
      SELECT 1
      FROM pg_indexes
      WHERE tablename='Question'
        AND indexname='idx_question_tsv'
    )`;

      if (!indexExists[0].exists) {
         await prisma.$executeRawUnsafe(`
        CREATE INDEX idx_question_tsv ON "Question" USING GIN(question_tsv);
      `);
      }

      // 4️⃣ Créer ou remplacer la fonction du trigger
      await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION question_tsv_trigger() RETURNS trigger AS $$
      BEGIN
        NEW.question_tsv := to_tsvector('french', NEW.content);
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

      // 5️⃣ Créer le trigger (supprime l'existant si nécessaire)
      await prisma.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS tsv_question_update ON "Question";
    `);
      await prisma.$executeRawUnsafe(`
      CREATE TRIGGER tsv_question_update
      BEFORE INSERT OR UPDATE ON "Question"
      FOR EACH ROW EXECUTE FUNCTION question_tsv_trigger();
    `);

      console.log('✅ Full-text search setup completed');
   } catch (err) {
      console.error('❌ Error setting up full-text search:', err);
      throw err;
   }
}