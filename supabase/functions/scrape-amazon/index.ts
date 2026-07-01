import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const FIRECRAWL_V2 = 'https://api.firecrawl.dev/v2';
const AFFILIATE_TAG = 'leandromar075-20';
const TARGET_URL = 'https://www.amazon.com.br/gp/goldbox';

function withAffiliate(url: string): string {
  try {
    const u = new URL(url, 'https://www.amazon.com.br');
    u.searchParams.set('tag', AFFILIATE_TAG);
    return u.toString();
  } catch {
    return url;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) throw new Error('FIRECRAWL_API_KEY não configurado');

    const schema = {
      type: 'object',
      properties: {
        ofertas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              titulo: { type: 'string' },
              preco: { type: 'string', description: 'Preço atual em reais, apenas número' },
              preco_original: { type: 'string' },
              desconto: { type: 'string', description: 'Percentual de desconto, ex: 30' },
              imagem: { type: 'string', description: 'URL absoluta da imagem' },
              link: { type: 'string', description: 'URL absoluta do produto na Amazon' },
            },
            required: ['titulo', 'preco', 'link'],
          },
        },
      },
      required: ['ofertas'],
    };

    const fcRes = await fetch(`${FIRECRAWL_V2}/scrape`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: TARGET_URL,
        formats: [
          {
            type: 'json',
            schema,
            prompt: 'Extraia todas as ofertas visíveis na página de ofertas da Amazon Brasil com título, preço atual, preço original (se houver), percentual de desconto, URL absoluta da imagem e URL absoluta do produto.',
          },
        ],
        onlyMainContent: true,
        waitFor: 2500,
        location: { country: 'BR', languages: ['pt-BR'] },
      }),
    });

    const fcData = await fcRes.json();
    if (!fcRes.ok) {
      console.error('Firecrawl error', fcRes.status, fcData);
      return new Response(JSON.stringify({ error: fcData?.error || 'Falha no Firecrawl', status: fcRes.status }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const json = fcData?.data?.json ?? fcData?.json ?? {};
    const ofertasRaw: any[] = Array.isArray(json?.ofertas) ? json.ofertas : [];

    const ofertas = ofertasRaw
      .filter((o) => o?.titulo && o?.link)
      .map((o, i) => ({
        id: `amz-${i}`,
        titulo: String(o.titulo).trim(),
        preco: String(o.preco ?? '').replace(/[^\d.,]/g, '').replace(',', '.'),
        preco_original: o.preco_original ? String(o.preco_original).replace(/[^\d.,]/g, '').replace(',', '.') : null,
        desconto: o.desconto ? String(o.desconto).replace(/[^\d]/g, '') : null,
        imagem: o.imagem || '',
        link: withAffiliate(String(o.link)),
      }));

    return new Response(
      JSON.stringify({ ofertas, total: ofertas.length, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=600' } }
    );
  } catch (err) {
    console.error('scrape-amazon error', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
