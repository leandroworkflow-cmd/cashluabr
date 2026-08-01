// Gera public/sitemap.xml antes de `vite dev` e `vite build` (hooks predev/prebuild).
// Inclui páginas estáticas, guias, hubs (categoria/marca/loja/intenção) e as
// páginas de oferta vindas da planilha do Google Sheets.

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
const SHEET_ID = "1x_45PJoQmKoFrCXeMAtvOXMlWrFYGB2tKcA6fFoS39s";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const MAX_DEALS = 300;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

function generateSlug(titulo: string, id: string): string {
  const normalized = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${normalized}-${id}`.slice(0, 120);
}

async function fetchDealPaths(): Promise<string[]> {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const json = JSON.parse(
      text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1),
    );
    const rows = (json.table?.rows ?? []).slice(0, MAX_DEALS);
    return rows
      .map((row: any, index: number) => {
        const titulo = row.c?.[1]?.v;
        const id = row.c?.[0]?.v?.toString() || `deal-${index}`;
        if (!titulo) return null;
        return `/oferta/${generateSlug(String(titulo), id)}`;
      })
      .filter(Boolean) as string[];
  } catch (error) {
    console.warn("sitemap: não foi possível ler a planilha de ofertas.", error);
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
