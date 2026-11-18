import { Deal } from "./types";
import { CATEGORY_HUBS, detectBrand, parsePrecoNumber } from "./seo-taxonomy";

// Palavras que aparecem em quase todo título de oferta e não ajudam a
// descobrir se dois produtos são parecidos.
const STOPWORDS = new Set([
  "de", "da", "do", "das", "dos", "a", "o", "as", "os", "e", "em", "para",
  "com", "por", "que", "um", "uma", "uns", "umas", "no", "na", "nos", "nas",
  "ao", "aos", "ou", "se", "sua", "seu", "suas", "seus", "mais", "menos",
  "muito", "super", "original", "novo", "nova", "oferta", "promocao",
  "preco", "compra", "kit", "unidade", "und", "cm", "mm", "kg", "ml",
  "litro", "pacote", "caixa", "frete", "gratis", "barato", "top", "linha",
  "modelo", "cor", "tamanho", "ano", "the", "of", "and", "for", "with",
  "new", "buy", "sale",
]);

const normalize = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Palavras úteis de um título, sem acento, sem stopwords e sem números soltos. */
export function titleTokens(titulo: string): string[] {
  return normalize(titulo)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * Nota de semelhança entre duas ofertas (0 = nada a ver).
 * Soma: mesma marca, mesma categoria, mesmo hub de categoria,
 * sobreposição de palavras do título e proximidade de preço.
 */
export function similarityScore(a: Deal, b: Deal): number {
  if (!a || !b || a.id === b.id) return 0;

  let score = 0;

  const brandA = detectBrand(a.titulo);
  const brandB = detectBrand(b.titulo);
  if (brandA && brandB && brandA === brandB) score += 4;

  if (a.categoria && b.categoria && a.categoria === b.categoria) score += 2;

  const hubA = CATEGORY_HUBS.find((h) => h.match(a));
  const hubB = CATEGORY_HUBS.find((h) => h.match(b));
  if (hubA && hubB && hubA.slug === hubB.slug) score += 1.5;

  const tokensA = new Set(titleTokens(a.titulo));
  const tokensB = new Set(titleTokens(b.titulo));
  if (tokensA.size > 0 && tokensB.size > 0) {
    let shared = 0;
    for (const t of tokensA) if (tokensB.has(t)) shared += 1;
    // Contenção: quantas palavras do título menor aparecem no outro.
    score += (shared / Math.min(tokensA.size, tokensB.size)) * 6;
  }

  const priceA = parsePrecoNumber(a.preco);
  const priceB = parsePrecoNumber(b.preco);
  if (priceA > 0 && priceB > 0) {
    const ratio = Math.min(priceA, priceB) / Math.max(priceA, priceB);
    if (ratio >= 0.65) score += (1 - (1 - ratio) / 0.35) * 1.5;
  }

  return score;
}

/** As ofertas mais parecidas com a dada, em ordem decrescente de semelhança. */
export function findSimilarDeals(
  target: Deal,
  pool: Deal[],
  limit = 6,
): Deal[] {
  if (!target || !pool?.length) return [];

  return pool
    .filter((d) => d.id !== target.id)
    .map((d) => ({ deal: d, score: similarityScore(target, d) }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.deal);
}
