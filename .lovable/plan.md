## Contexto

O site já tem página individual por oferta (`/oferta/:slug`), SEO por rota com react-helmet-async, Schema Product, robots.txt e sitemap.xml estático. O que falta é justamente o "valor agregado": texto único, histórico de preços, páginas de categoria/marca/loja, breadcrumb e sitemap automático.

Uma observação importante: **Grok não está disponível** no gateway de IA do Lovable. Uso o melhor modelo disponível (Gemini 3.6 Flash para geração em volume) — mesmo resultado, sem chave externa.

## Fase 1 — Base SEO das ofertas (maior impacto)

- **Breadcrumb** visual + `BreadcrumbList` JSON-LD em `/oferta/:slug`: Home > Categoria > Produto.
- **Descrição única por oferta gerada por IA** (300–500 palavras + FAQ), gerada sob demanda na primeira visita e salva no banco (tabela `deal_content`: slug, título SEO, meta description, corpo, FAQ). Depois disso é servida do cache, sem custo repetido.
- **FAQPage JSON-LD** a partir da FAQ gerada.
- Meta title/description vindos do conteúdo gerado, com fallback para o atual.
- Melhorar o Schema Product existente (marca, categoria, `priceValidUntil`).

## Fase 2 — Histórico de preços

- Tabela `price_history` (deal_id, preço, data), alimentada a cada sincronização da planilha por uma função agendada diária.
- Gráfico simples + "menor preço em 30 dias" na página da oferta.
- Schema `Offer` com `lowPrice`/`highPrice` quando houver histórico.

## Fase 3 — Páginas de hub

- `/categoria/:slug` (celulares, notebooks, games, moda…), `/marca/:slug` (nike, xiaomi, samsung…), `/loja/:slug` (shopee, amazon, mercado-livre).
- Cada uma com H1 próprio, texto introdutório e FAQ gerados por IA (cacheados), listagem de ofertas e links internos cruzados.
- Extração de marca a partir do título da oferta.

## Fase 4 — Páginas de intenção e tendências

- `/ofertas-ate-100`, `/descontos-acima-70`, `/top-100-semana`, `/mais-acessados`, `/maior-desconto`.
- Ranking baseado em cliques reais (já contamos cliques nos links curtos).

## Fase 5 — Sitemap automático + indexação

- Gerador de sitemap que lê ofertas, categorias, marcas, lojas e guias — rodando em `predev`/`prebuild` e em uma função agendada.
- `robots.txt` com Sitemap apontando para o domínio final.
- Passo a passo para verificar o site no Search Console e enviar o sitemap (esse passo é manual, feito por você).

## Fase 6 — Performance

- Imagens com `loading="lazy"` + `width/height` (evita CLS), `fetchpriority` no LCP, preload do banner do topo.

## Detalhes técnicos

- Geração de conteúdo em Edge Function com Lovable AI (`google/gemini-3.6-flash`), com resultado persistido — nunca gera o mesmo texto duas vezes.
- Limitação conhecida: o app é SPA (Vite), então crawlers que não executam JS veem só o `index.html`. O Googlebot executa JS e lê o conteúdo, mas previews sociais por rota exigem SSR. Se isso importar, dá para migrar para o template TanStack Start ([o que a migração traz](https://lovable.dev/blog/building-apps-using-tanstack-start)).
- O conteúdo gerado por IA será marcado como cacheado por oferta, para não estourar custo com 7 mil linhas da planilha — gera só para ofertas efetivamente visitadas ou listadas.

## Sugestão de execução

Começar pela Fase 1 + Fase 5, que juntas resolvem o problema central de "conteúdo duplicado sem valor" e garantem indexação. Depois seguir para 2, 3 e 4.
