import { supabase } from "@/integrations/supabase/client";
import { Deal } from "./types";
import { parsePrecoNumber } from "./seo-taxonomy";

export interface ClickStat {
  pageUrl: string;
  title: string;
  clicks: number;
}

export interface PriceDelta {
  dealId: string;
  slug: string | null;
  first: number;
  last: number;
  /** Queda percentual entre a primeira e a última leitura (0 a 100). */
  dropPct: number;
  days: number;
}

/**
 * Cliques reais registrados nos links curtos do site (tabela short_links).
 * É a única medida de interesse que temos de verdade — nada de número inventado.
 */
export async function fetchClickStats(limit = 60): Promise<ClickStat[]> {
  const { data, error } = await supabase
    .from("short_links")
    .select("page_url, title, clicks")
    .not("page_url", "is", null)
    .order("clicks", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data
    .filter((row) => typeof row.page_url === "string" && row.page_url.startsWith("/oferta/"))
    .map((row) => ({
      pageUrl: row.page_url as string,
      title: (row.title as string) || (row.page_url as string),
      clicks: Number(row.clicks) || 0,
    }));
}

/**
 * Compara a primeira e a última leitura de preço de cada oferta.
 * Retorna só as que realmente ficaram mais baratas.
 */
export async function fetchPriceDeltas(): Promise<PriceDelta[]> {
  const { data, error } = await supabase
    .from("price_history")
    .select("deal_id, slug, price, captured_at")
    .order("captured_at", { ascending: true })
    .limit(5000);

  if (error || !data) return [];

  const byDeal = new Map<string, { slug: string | null; points: { date: string; price: number }[] }>();
  for (const row of data) {
    const price = Number(row.price);
    if (!Number.isFinite(price) || price <= 0) continue;
    const key = String(row.deal_id);
    const entry = byDeal.get(key) ?? { slug: (row.slug as string) ?? null, points: [] };
    entry.points.push({ date: String(row.captured_at), price });
    byDeal.set(key, entry);
  }

  const deltas: PriceDelta[] = [];
  for (const [dealId, entry] of byDeal) {
    if (entry.points.length < 2) continue;
    const first = entry.points[0].price;
    const last = entry.points[entry.points.length - 1].price;
    if (last >= first) continue;
    const days = new Set(entry.points.map((p) => p.date)).size;
    deltas.push({
      dealId,
      slug: entry.slug,
      first,
      last,
      dropPct: ((first - last) / first) * 100,
      days,
    });
  }

  return deltas.sort((a, b) => b.dropPct - a.dropPct);
}

/** Maiores descontos informados pelas lojas. */
export function topByDiscount(deals: Deal[], limit = 12): Deal[] {
  return [...deals]
    .filter((d) => Number(d.temperatura) > 0)
    .sort((a, b) => Number(b.temperatura) - Number(a.temperatura))
    .slice(0, limit);
}

/** Ofertas mais recentes da base. */
export function topRecent(deals: Deal[], limit = 12): Deal[] {
  return [...deals]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, limit);
}

/** Só as ofertas que realmente caíram de preço nas leituras do site. */
export function dealsWithFallingPrices(deals: Deal[], deltas: PriceDelta[], limit = 12): Deal[] {
  if (!deltas.length) return [];
  const byId = new Map(deltas.map((d) => [d.dealId, d]));
  return deals
    .map((d) => ({ deal: d, delta: byId.get(d.id) }))
    .filter((x): x is { deal: Deal; delta: PriceDelta } => Boolean(x.delta))
    .sort((a, b) => b.delta.dropPct - a.delta.dropPct)
    .slice(0, limit)
    .map((x) => x.deal);
}

/** Ofertas mais clicadas, cruzando os cliques reais com a base atual. */
export function dealsByClicks(deals: Deal[], stats: ClickStat[], limit = 12): Deal[] {
  if (!stats.length) return [];
  const clicksBySlug = new Map(
    stats.map((s) => [s.pageUrl.replace("/oferta/", ""), s.clicks]),
  );
  return deals
    .map((d) => ({ deal: d, clicks: clicksBySlug.get(d.slug) ?? 0 }))
    .filter((x) => x.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, limit)
    .map((x) => x.deal);
}

/** Faixa de preço mais comum — usado no texto de introdução da página. */
export function priceRangeLabel(deals: Deal[]): string {
  const prices = deals.map((d) => parsePrecoNumber(d.preco)).filter((p) => p > 0);
  if (!prices.length) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  return `de R$ ${fmt(min)} a R$ ${fmt(max)}`;
}
