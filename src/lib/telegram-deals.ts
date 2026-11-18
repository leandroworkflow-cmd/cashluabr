import { supabase } from "@/integrations/supabase/client";
import { Deal } from "./types";
import { inferCategory, generateSlug, fetchDealsFromSheet } from "./google-sheets";

const MAX_DEALS = 300;

// Ofertas Shopee (sincronizadas do datafeed de afiliado).
// Lança erro em vez de devolver lista vazia, para que a falha apareça no log
// e o chamador decida o que fazer (antes o erro era engolido em silêncio).
async function fetchDealsFromShopee(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("shopee_deals")
    .select("itemid, title, price, sale_price, discount, image, link, shop_name, category, synced_at")
    .order("discount", { ascending: false })
    .limit(MAX_DEALS);

  if (error) throw new Error(`shopee_deals: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: `shopee-${row.itemid}`,
    slug: generateSlug(row.title, `shopee-${row.itemid}`),
    titulo: row.title,
    preco: Number(row.sale_price).toFixed(2),
    link: row.link,
    imagem: row.image ?? "",
    data: row.synced_at,
    loja: row.shop_name ?? "Shopee",
    categoria: (row.category as Deal["categoria"]) ?? inferCategory(row.title),
    temperatura: row.discount ?? 0,
    comentarios: 0,
  }));
}

async function fetchDealsFromTelegramTable(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("telegram_deals")
    .select("message_id, slug, titulo, preco, link, imagem, loja, categoria, posted_at")
    .order("posted_at", { ascending: false })
    .limit(MAX_DEALS);

  if (error) throw new Error(`telegram_deals: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: String(row.message_id),
    slug: row.slug,
    titulo: row.titulo,
    preco: (row.preco ?? "0").replace(/^R\$\s*/i, "").trim(),
    link: row.link,
    imagem: row.imagem ?? "",
    data: row.posted_at,
    loja: row.loja ?? "Loja Online",
    categoria: row.categoria ?? inferCategory(row.titulo),
    temperatura: 0,
    comentarios: 0,
  }));
}

// Ordem de prioridade: Telegram (mais recentes) + Shopee. As duas fontes são
// buscadas em paralelo e independentes: se uma falha, a outra continua valendo.
// Se o banco não devolver nada (tabelas vazias ou indisponíveis), usa a
// planilha do Google como reserva para o painel nunca ficar sem ofertas.
export async function fetchDealsFromTelegram(): Promise<Deal[]> {
  const [telegramRes, shopeeRes] = await Promise.allSettled([
    fetchDealsFromTelegramTable(),
    fetchDealsFromShopee(),
  ]);

  const failures: string[] = [];
  if (telegramRes.status === "rejected") {
    failures.push(String(telegramRes.reason?.message ?? telegramRes.reason));
  }
  if (shopeeRes.status === "rejected") {
    failures.push(String(shopeeRes.reason?.message ?? shopeeRes.reason));
  }
  if (failures.length) console.error("[CashLua] Falha ao carregar ofertas do banco:", failures.join(" | "));

  const telegram = telegramRes.status === "fulfilled" ? telegramRes.value : [];
  const shopee = shopeeRes.status === "fulfilled" ? shopeeRes.value : [];
  const combined = [...telegram, ...shopee].slice(0, MAX_DEALS);
  if (combined.length > 0) return combined;

  console.warn("[CashLua] Banco sem ofertas; usando planilha como reserva.");
  return fetchDealsFromSheet();
}
