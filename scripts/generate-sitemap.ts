// Gera public/sitemap.xml antes de `vite dev` e `vite build` (hooks predev/prebuild).
// Inclui páginas estáticas, guias, hubs (categoria/marca/loja/intenção) e as
// páginas de oferta publicadas no canal do Telegram.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { guiasContent } from "../src/lib/guias-content";
import {
  CATEGORY_HUBS,
  BRANDS,
  brandSlug,
  STORES,
  INTENT_HUBS,
} from "../src/lib/seo-taxonomy";

const BASE_URL = "https://www.cashlua.com.br";
const SUPABASE_URL = "https://hnbanhzlxtvzhbqxepap.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuYmFuaHpseHR2emhicXhlcGFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTQ1MTIsImV4cCI6MjA5NDc3MDUxMn0.kSoZB1NCpAvx4FoBBm6tyXQU5zoUddm7JGWNL7g6jrI";
const MAX_DEALS = 300;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

async function fetchDealPaths(): Promise<string[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/telegram_deals?select=slug&order=posted_at.desc&limit=${MAX_DEALS}`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
    );
    const rows = (await res.json()) as Array<{ slug: string }>;
    if (!Array.isArray(rows)) return [];
    return rows.filter((r) => r?.slug).map((r) => `/oferta/${r.slug}`);
  } catch (error) {
    console.warn("sitemap: não foi possível ler as ofertas do Telegram.", error);
    return [];
  }
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function render(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${xmlEscape(BASE_URL + e.path)}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const entries: SitemapEntry[] = [
    { path: "/", changefreq: "hourly", priority: "1.0" },
    { path: "/ofertas-do-dia", changefreq: "hourly", priority: "0.9" },
    { path: "/ofertas-amazon", changefreq: "hourly", priority: "0.9" },
    { path: "/ofertas-shopee", changefreq: "hourly", priority: "0.9" },
    { path: "/categorias", changefreq: "weekly", priority: "0.8" },
    { path: "/guias", changefreq: "weekly", priority: "0.7" },
    { path: "/sobre", changefreq: "monthly", priority: "0.5" },
    { path: "/contato", changefreq: "monthly", priority: "0.5" },
    { path: "/termos", changefreq: "yearly", priority: "0.3" },
    { path: "/privacidade", changefreq: "yearly", priority: "0.3" },
  ];

  for (const hub of INTENT_HUBS) {
    entries.push({ path: hub.path, changefreq: "daily", priority: "0.8" });
  }
  for (const hub of CATEGORY_HUBS) {
    entries.push({ path: `/categoria/${hub.slug}`, changefreq: "daily", priority: "0.8" });
  }
  for (const store of STORES) {
    entries.push({ path: `/loja/${store.slug}`, changefreq: "daily", priority: "0.7" });
  }
  for (const brand of BRANDS) {
    entries.push({ path: `/marca/${brandSlug(brand)}`, changefreq: "daily", priority: "0.6" });
  }
  for (const guia of guiasContent) {
    entries.push({ path: `/guias/${guia.slug}`, changefreq: "monthly", priority: "0.6" });
  }
  for (const path of await fetchDealPaths()) {
    entries.push({ path, changefreq: "daily", priority: "0.7" });
  }

  writeFileSync(resolve("public/sitemap.xml"), render(entries));
  console.log(`sitemap.xml gerado (${entries.length} URLs)`);
}

main();
