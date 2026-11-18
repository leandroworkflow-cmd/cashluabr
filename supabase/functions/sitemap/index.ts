// Edge function: sitemap
// Serve o sitemap.xml ao vivo, direto do banco, sem depender de publicar o site.
// Cada oferta nova entra no mapa em minutos.

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE = "https://www.cashlua.com.br";

const HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
};

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// Mesma função de slug usada no site (src/lib/google-sheets.ts).
function generateSlug(titulo: string, id: string): string {
  const normalized = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${normalized}-${id}`.slice(0, 120);
}

// Listas fixas do site (manter em dia com src/lib/seo-taxonomy.ts e guias-content.ts).
const CATEGORY_SLUGS = ["celulares", "notebooks", "fones-de-ouvido", "eletrodomesticos", "games", "moda-masculina", "moda-feminina", "beleza", "esportes", "ferramentas"];
const STORE_SLUGS = ["shopee", "amazon", "mercado-livre", "magalu", "netshoes", "aliexpress"];
const BRAND_SLUGS = ["samsung", "xiaomi", "apple", "motorola", "lg", "nike", "adidas", "philips", "mondial", "electrolux", "jbl", "sony", "logitech", "multilaser", "positivo", "lenovo", "dell", "acer", "asus", "havaianas", "nivea", "colgate", "bosch", "tramontina"];
const INTENT_PATHS = ["/ofertas-ate-100", "/ofertas-ate-50", "/mais-baratas", "/top-100-semana"];
const GUIA_SLUGS = ["como-saber-se-uma-oferta-e-boa", "melhores-epocas-para-comprar-eletronicos", "cupom-de-desconto-vale-a-pena", "como-comprar-com-seguranca-online", "planejar-orcamento-para-compras", "diferenca-cashback-cupom-oferta", "pix-parcelado-vale-a-pena", "frete-gratis-vale-a-pena", "como-acertar-tamanho-roupas-calcados-online", "vale-a-pena-comprar-eletroportateis-na-promocao", "como-cancelar-pedido-reembolso-marketplace"];

const STATIC_PAGES: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "hourly" },
  { path: "/tendencias", priority: "0.9", changefreq: "hourly" },
  { path: "/blog", priority: "0.8", changefreq: "daily" },
  { path: "/ofertas-shopee", priority: "0.8", changefreq: "hourly" },
  { path: "/ofertas-do-dia", priority: "0.8", changefreq: "hourly" },
  { path: "/ofertas-amazon", priority: "0.7", changefreq: "daily" },
  { path: "/categorias", priority: "0.7", changefreq: "daily" },
  { path: "/sobre", priority: "0.5", changefreq: "monthly" },
  { path: "/contato", priority: "0.4", changefreq: "monthly" },
  { path: "/termos", priority: "0.3", changefreq: "monthly" },
  { path: "/privacidade", priority: "0.3", changefreq: "monthly" },
];

function url(loc: string, lastmod: string | null, priority: string, changefreq: string) {
  return [
    "  <url>",
    `    <loc>${SITE}${loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].filter(Boolean).join("\n");
}

Deno.serve(async () => {
  try {
    const urls: string[] = [];

    for (const page of STATIC_PAGES) {
      urls.push(url(page.path, new Date().toISOString().slice(0, 10), page.priority, page.changefreq));
    }

    for (const slug of CATEGORY_SLUGS) urls.push(url(`/categoria/${slug}`, null, "0.8", "daily"));
    for (const slug of STORE_SLUGS) urls.push(url(`/loja/${slug}`, null, "0.8", "daily"));
    for (const slug of BRAND_SLUGS) urls.push(url(`/marca/${slug}`, null, "0.7", "weekly"));
    for (const path of INTENT_PATHS) urls.push(url(path, null, "0.8", "daily"));
    for (const slug of GUIA_SLUGS) urls.push(url(`/guias/${slug}`, null, "0.7", "monthly"));

    // Ofertas do canal do Telegram.
    const { data: telegram } = await db
      .from("telegram_deals")
      .select("slug, posted_at")
      .order("posted_at", { ascending: false })
      .limit(400);

    for (const row of telegram ?? []) {
      if (!row.slug) continue;
      urls.push(url(`/oferta/${row.slug}`, String(row.posted_at || "").slice(0, 10), "0.7", "daily"));
    }

    // Ofertas Shopee (slug gerado igual ao do site).
    const { data: shopee } = await db
      .from("shopee_deals")
      .select("itemid, title")
      .order("discount", { ascending: false })
      .limit(400);

    for (const row of shopee ?? []) {
      const slug = generateSlug(String(row.title), String(row.itemid));
      urls.push(url(`/oferta/${slug}`, null, "0.6", "weekly"));
    }

    // Artigos do blog.
    const { data: blog } = await db
      .from("blog_posts")
      .select("slug, published_at")
      .order("published_on", { ascending: false })
      .limit(200);

    for (const row of blog ?? []) {
      urls.push(url(`/blog/${row.slug}`, String(row.published_at || "").slice(0, 10), "0.8", "daily"));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

    return new Response(xml, { headers: HEADERS });
  } catch (err) {
    console.error("sitemap falhou:", err);
    return new Response('<?xml version="1.0"?><error/>', { status: 500, headers: HEADERS });
  }
});
