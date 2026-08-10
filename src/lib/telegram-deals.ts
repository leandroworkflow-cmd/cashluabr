import { supabase } from "@/integrations/supabase/client";
import { Deal } from "./types";
import { inferCategory } from "./google-sheets";

const MAX_DEALS = 300;

export async function fetchDealsFromTelegram(): Promise<Deal[]> {
  const { data, error } = await supabase
    .from("telegram_deals")
    .select("message_id, slug, titulo, preco, link, imagem, loja, categoria, posted_at")
    .order("posted_at", { ascending: false })
    .limit(MAX_DEALS);

  if (error) {
    console.error("Erro ao carregar ofertas do Telegram:", error.message);
    throw new Error("Não foi possível carregar as ofertas");
  }

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
