import { supabase } from "@/integrations/supabase/client";
import { Deal } from "./types";
import { inferCategory, generateSlug } from "./google-sheets";

const MAX_DEALS = 300;

// Enquanto o canal do Telegram não tiver posts novos, mostramos as ofertas Shopee.
async function fetchDealsFromShopee(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("shopee_deals")
    .select("itemid, title, price, sale_price, discount, image, link, shop_name, category, synced_at")
    .order("discount", { ascending: false })
    .limit(MAX_DEALS);

  if (error || !data) return [];

  return data.map((row) => ({
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

export async function fetchDealsFromTelegram(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("telegram_deals")
    .select("message_id, slug, titulo, preco, link, imagem, loja, categoria, posted_at")
    .order("posted_at", { ascending: false })
    .limit(MAX_DEALS);

  if (error) {
    console.error("Erro ao carregar ofertas do Telegram:", error.message);
    return fetchDealsFromShopee();
  }

  const shopee = await fetchDealsFromShopee();
  if (!data || data.length === 0) return shopee;

  // Telegram primeiro (mais recentes), completado com as ofertas Shopee.
  const telegram: Deal[] = data.map((row) => ({
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
  return [...telegram, ...shopee].slice(0, MAX_DEALS);
}
