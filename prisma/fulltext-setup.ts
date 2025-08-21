import { prisma } from '@/lib/prisma';

async function main() {
   await prisma.$executeRawUnsafe(`
    ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS question_tsv tsvector;
    UPDATE "Question" SET question_tsv = to_tsvector('french', content);
    CREATE INDEX IF NOT EXISTS idx_question_tsv ON "Question" USING GIN(question_tsv);
    CREATE OR REPLACE FUNCTION question_tsv_trigger() RETURNS trigger AS $$
    BEGIN
      NEW.question_tsv := to_tsvector('french', NEW.content);
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;
    CREATE TRIGGER IF NOT EXISTS tsv_question_update
    BEFORE INSERT OR UPDATE ON "Question"
    FOR EACH ROW EXECUTE FUNCTION question_tsv_trigger();
  `);

   console.log('✅ Full-text search initialized');
}

main()
   .catch((e) => console.error(e))
   .finally(() => prisma.$disconnect());