import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return Response.json({ results: [] });
  }

  // Étape 1 : PostgreSQL (FTS + trigramme)

  const pgResults = await prisma.$queryRawUnsafe<any[]>(`
  SELECT id, content,
    similarity(unaccent(content), unaccent($1)) AS trigram_score,
    ts_rank_cd(to_tsvector('simple', unaccent(content)), plainto_tsquery('simple', unaccent($1))) AS fts_score
  FROM "Question"
  WHERE unaccent(content) ILIKE '%' || unaccent($1) || '%'
     OR to_tsvector('simple', unaccent(content)) @@ plainto_tsquery('simple', unaccent($1))
     OR similarity(unaccent(content), unaccent($1)) > 0.2
  ORDER BY 
    ts_rank_cd(to_tsvector('simple', unaccent(content)), plainto_tsquery('simple', unaccent($1)))
    + similarity(unaccent(content), unaccent($1)) DESC
  LIMIT 50;
`, query);


  // Étape 2 : Fuse.js en fallback (fuzzy JS côté Node)
  const fuse = new Fuse(pgResults, {
    keys: ["content"],
    includeScore: true,
    threshold: 0.4, // 0.0 = strict, 1.0 = très tolérant
  });

  const finalResults = fuse.search(query).map(r => r.item);

  return Response.json({ results: finalResults });
}