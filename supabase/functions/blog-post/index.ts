// Edge function: blog-post
// Gera o artigo do dia com IA a partir das ofertas REAIS do banco.
// - GET  /blog-post            -> lista os últimos artigos
// - GET  /blog-post?slug=...   -> um artigo
// - POST /blog-post            -> garante o artigo de hoje (cria se não existir)

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const GATEWAY_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const MODEL = "openai/gpt-6.1-sol";

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

interface RawDeal {
  titulo: string;
  itemId: string;
  preco: string;
  desconto: number;
  categoria: string;
  loja: string;
}

// Mesmo slug usado pelo site para montar o endereço da oferta.
function generateSlug(titulo: string, id: string): string {
  const normalized = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${normalized}-${id}`.slice(0, 120);
}

/** As ofertas de maior desconto que realmente estão no banco. */
async function pickDeals(): Promise<RawDeal[]> {
  const { data, error } = await db
    .from("shopee_deals")
    .select("itemid, title, sale_price, discount, category")
    .gte("discount", 30)
    .order("discount", { ascending: false })
    .limit(240);

  if (error || !data) return [];

  const seen = new Set<string>();
  const deals: RawDeal[] = [];
  for (const row of data) {
    const key = String(row.title).toLowerCase().slice(0, 40);
    if (seen.has(key)) continue;
    seen.add(key);
    deals.push({
      titulo: String(row.title),
      itemId: String(row.itemid),
      preco: `R$ ${Number(row.sale_price).toFixed(2).replace(".", ",")}`,
      desconto: Number(row.discount) || 0,
      categoria: String(row.category || "diversos"),
      loja: "Shopee",
    });
    if (deals.length >= 12) break;
  }
  return deals;
}

/** Produtos que realmente ficaram mais baratos entre as leituras de preço. */
async function pickFallingPrices(): Promise<{ titulo: string; de: string; por: string }[]> {
  const { data, error } = await db
    .from("price_history")
    .select("deal_id, slug, price, captured_at")
    .order("captured_at", { ascending: true })
    .limit(4000);

  if (error || !data) return [];

  const byDeal = new Map<string, { slug: string; first: number; last: number }>();
  for (const row of data) {
    const price = Number(row.price);
    if (!Number.isFinite(price) || price <= 0) continue;
    const key = String(row.deal_id);
    const entry = byDeal.get(key) ?? { slug: String(row.slug || ""), first: price, last: price };
    entry.last = price;
    byDeal.set(key, entry);
  }

  return [...byDeal.values()]
    .filter((e) => e.slug && e.last < e.first)
    .sort((a, b) => (a.first - a.last) / a.first > (b.first - b.last) / b.first ? -1 : 1)
    .slice(0, 8)
    .map((e) => ({
      titulo: e.slug.replace(/-\d+$/, "").replace(/-/g, " "),
      de: `R$ ${e.first.toFixed(2).replace(".", ",")}`,
      por: `R$ ${e.last.toFixed(2).replace(".", ",")}`,
    }));
}

const SCHEMA = {
  type: "object",
  properties: {
    slug: { type: "string" },
    title: { type: "string" },
    meta_description: { type: "string" },
    excerpt: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    paragraphs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          text: { type: "string" },
        },
        required: ["text"],
      },
    },
  },
  required: ["slug", "title", "meta_description", "excerpt", "tags", "paragraphs"],
};

async function writeArticle(
  deals: RawDeal[],
  falling: { titulo: string; de: string; por: string }[],
) {
  const today = new Date().toISOString().slice(0, 10);

  const system = [
    "Você escreve o artigo diário do blog do CashLua, site brasileiro de ofertas.",
    "Regras inegociáveis:",
    "- Use SOMENTE os produtos, preços e descontos da lista fornecida. Nunca invente produto, preço, marca, especificação ou data.",
    "- Se não souber uma especificação, não cite. Fale de uso, economia e contexto de compra.",
    "- Português do Brasil, tom direto de quem caça promoção, sem promessas de investimento ou saúde.",
    "- 700 a 900 palavras no total, divididas em 5 a 7 seções.",
    "- Cada seção tem um heading curto (sem #) e um parágrafo de 90 a 160 palavras.",
    "- A primeira seção não tem heading.",
    "- Termine com uma seção sobre acompanhar o preço antes de comprar.",
    "- O slug deve ser curto, em minúsculas, sem acento, separado por hífen, e terminar com a data no formato aaaammdd.",
    "- meta_description com no máximo 155 caracteres, citando o produto de maior desconto.",
    "- excerpt com 1 a 2 frases.",
    "- tags: 3 a 5 palavras soltas em minúsculas.",
    "Responda apenas com JSON no formato pedido.",
  ].join("\n");

  const user = [
    `Data de hoje: ${today}.`,
    "",
    "Ofertas de maior desconto agora:",
    ...deals.map((d) => `- ${d.titulo} | ${d.preco} | ${d.desconto}% de desconto | ${d.categoria}`),
    "",
    falling.length
      ? [
          "Produtos que ficaram mais baratos nas últimas leituras:",
          ...falling.map((f) => `- ${f.titulo} | caiu de ${f.de} para ${f.por}`),
        ].join("\n")
      : "Nenhum produto com histórico de queda registrado hoje.",
  ].join("\n");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": GATEWAY_KEY,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 3000,
      response_format: {
        type: "json_schema",
        json_schema: { name: "article", schema: SCHEMA },
      },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) throw new Error(`gateway ${res.status}: ${await res.text()}`);
  const payload = await res.json();
  const raw = payload?.choices?.[0]?.message?.content;
  if (!raw) throw new Error("resposta vazia do modelo");

  const article = JSON.parse(raw);
  const body = (article.paragraphs as { heading?: string; text: string }[])
    .map((p) => (p.heading ? `## ${p.heading}\n\n${p.text}` : p.text))
    .join("\n\n");

  return {
    slug: String(article.slug).toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 90),
    title: String(article.title).slice(0, 120),
    meta_description: String(article.meta_description).slice(0, 200),
    excerpt: String(article.excerpt).slice(0, 400),
    body,
    tags: (article.tags as string[]).slice(0, 5),
    deal_refs: deals.slice(0, 6).map((d) => ({
      slug: generateSlug(d.titulo, d.itemId),
      title: d.titulo,
      preco: d.preco,
    })),
    published_on: today,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    if (req.method === "GET" && url.searchParams.get("slug")) {
      const slug = url.searchParams.get("slug")!;
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) return json({ error: error.message }, 500);
      return data ? json(data) : json({ error: "artigo não encontrado" }, 404);
    }

    if (req.method === "GET") {
      const { data, error } = await db
        .from("blog_posts")
        .select("slug, title, meta_description, excerpt, tags, published_on, published_at")
        .order("published_on", { ascending: false })
        .limit(30);
      return json(error ? [] : data);
    }

    // POST: garante o artigo de hoje.
    const today = new Date().toISOString().slice(0, 10);
    const { data: existing } = await db
      .from("blog_posts")
      .select("*")
      .eq("published_on", today)
      .maybeSingle();
    if (existing) return json(existing);

    const deals = await pickDeals();
    if (!deals.length) return json({ error: "sem ofertas no banco para gerar o artigo" }, 503);

    const falling = await pickFallingPrices();
    const article = await writeArticle(deals, falling);

    const { data: inserted, error } = await db
      .from("blog_posts")
      .insert(article)
      .select()
      .single();

    if (error) {
      console.error("insert blog_posts:", error.message);
      const { data: again } = await db
        .from("blog_posts")
        .select("*")
        .eq("published_on", today)
        .maybeSingle();
      return again ? json(again) : json({ error: error.message }, 500);
    }

    return json(inserted, 201);
  } catch (err) {
    console.error("blog-post falhou:", err);
    return json({ error: "falha ao gerar o artigo" }, 500);
  }
});
