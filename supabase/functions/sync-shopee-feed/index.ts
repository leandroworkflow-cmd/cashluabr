import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Lê o datafeed de afiliado da Shopee (CSV gigante, ~200MB) em streaming,
// filtra as melhores ofertas e grava em public.shopee_deals.
// Para de ler o stream assim que atinge o limite de linhas analisadas.

const MAX_SCAN_ROWS = 120_000;
const MAX_DEALS = 800;
const MIN_DISCOUNT = 25;

const CATEGORY_MAP: Record<string, string> = {
  'Mobile & Gadgets': 'Eletrônicos',
  'Computers & Accessories': 'Eletrônicos',
  'Cameras & Drones': 'Eletrônicos',
  'Audio': 'Eletrônicos',
  'Home Appliances': 'Casa',
  'Home & Living': 'Casa',
  'Home Entertainment': 'Eletrônicos',
  'Beauty': 'Beleza',
  'Health': 'Beleza',
  'Sports & Outdoors': 'Esportes',
  'Books & Magazines': 'Livros',
  'Stationery': 'Livros',
  'Food & Beverages': 'Alimentos',
  'Women Clothes': 'Moda',
  'Men Clothes': 'Moda',
  'Women Shoes': 'Moda',
  'Men Shoes': 'Moda',
  'Women Bags': 'Moda',
  'Men Bags': 'Moda',
  'Fashion Accessories': 'Moda',
  'Watches': 'Moda',
  'Baby & Kids Fashion': 'Moda',
  'Gaming & Consoles': 'Games',
  'Hobbies & Collections': 'Games',
  'Toys, Kids & Babies': 'Games',
};

// Parser CSV incremental (aspas duplas, quebras de linha dentro de campos).
function makeCsvParser(onRow: (row: string[]) => boolean) {
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  let prevQuote = false;
  let stop = false;

  return {
    push(chunk: string) {
      if (stop) return true;
      for (let i = 0; i < chunk.length; i++) {
        const c = chunk[i];
        if (inQuotes) {
          if (prevQuote) {
            prevQuote = false;
            if (c === '"') { field += '"'; continue; }
            inQuotes = false;
            // cai para o tratamento normal abaixo
          } else if (c === '"') { prevQuote = true; continue; }
          else { field += c; continue; }
        }
        if (c === '"') { inQuotes = true; continue; }
        if (c === ',') { row.push(field); field = ''; continue; }
        if (c === '\n') {
          row.push(field.replace(/\r$/, ''));
          field = '';
          const finished = row;
          row = [];
          if (onRow(finished)) { stop = true; return true; }
          continue;
        }
        field += c;
      }
      return false;
    },
    get stopped() { return stop; },
  };
}

function num(v: string | undefined): number {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const feedUrl = Deno.env.get('SHOPEE_FEED_URL');
    const affiliateId = Deno.env.get('SHOPEE_AFFILIATE_ID');
    if (!feedUrl) {
      return new Response(JSON.stringify({ error: 'SHOPEE_FEED_URL não configurada' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(feedUrl, { redirect: 'follow' });
    if (!res.ok || !res.body) {
      const details = await res.text().catch(() => '');
      console.error(`Shopee feed falhou [${res.status}]: ${details.slice(0, 300)}`);
      return new Response(
        JSON.stringify({ error: 'Falha ao baixar o feed da Shopee', status: res.status, details: details.slice(0, 300) }),
        { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let header: string[] | null = null;
    let scanned = 0;
    const deals: Record<string, unknown>[] = [];
    const seen = new Set<string>();

    const parser = makeCsvParser((cols) => {
      if (!header) {
        header = cols.map((h) => h.replace(/^\uFEFF/, '').trim());
        return false;
      }
      scanned++;
      const get = (name: string) => cols[header!.indexOf(name)];

      const itemid = String(get('itemid') ?? '').trim();
      const title = String(get('title') ?? '').trim();
      const sale = num(get('sale_price'));
      const price = num(get('price'));
      const discount = Math.round(num(get('discount_percentage')));
      const image = String(get('image_link') ?? '').trim();
      const short = String(get('product short link') ?? get('product_short link') ?? '').trim();
      const rating = num(get('item_rating'));
      const likes = Math.round(num(get('like')));

      const ok =
        itemid && title && sale > 0 && image && short &&
        !seen.has(itemid) &&
        discount >= MIN_DISCOUNT &&
        rating >= 4.5 &&
        likes >= 50;

      if (ok) {
        seen.add(itemid);
        const link = `${short}${short.includes('?') ? '&' : '?'}affiliate_id=${affiliateId ?? ''}&sub_id=cashlua`;
        const cat1 = String(get('global_category1') ?? '').trim();
        deals.push({
          itemid, title,
          price: price > 0 ? price : null,
          sale_price: sale,
          discount,
          image,
          link,
          shop_name: String(get('shop_name') ?? '').trim() || null,
          category: CATEGORY_MAP[cat1] ?? 'Casa',
          rating,
          likes,
          synced_at: new Date().toISOString(),
        });
      }

      return deals.length >= MAX_DEALS || scanned >= MAX_SCAN_ROWS;
    });

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (parser.push(value)) break;
    }
    await reader.cancel().catch(() => {});

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let saved = 0;
    for (let i = 0; i < deals.length; i += 200) {
      const chunk = deals.slice(i, i + 200);
      const { error } = await supabase.from('shopee_deals').upsert(chunk, { onConflict: 'itemid' });
      if (error) {
        console.error('Erro ao gravar shopee_deals:', error.message);
        return new Response(JSON.stringify({ error: error.message, saved }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      saved += chunk.length;
    }

    return new Response(JSON.stringify({ scanned, saved, fetchedAt: new Date().toISOString() }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('sync-shopee-feed error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
