import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789';

function generateCode(len = 6): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const url: string | undefined = body?.url;
    const title: string | null = body?.title ?? null;
    const image: string | null = body?.image ?? null;
    const price: string | null = body?.price ?? null;

    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return new Response(JSON.stringify({ error: 'valid url required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Reaproveita código existente para a mesma URL
    const { data: existing } = await supabase
      .from('short_links')
      .select('code, title, image, price')
      .eq('url', url)
      .limit(1)
      .maybeSingle();

    let code = existing?.code as string | undefined;

    if (code) {
      // Atualiza metadados ausentes
      const patch: Record<string, string> = {};
      if (title && !existing?.title) patch.title = title;
      if (image && !existing?.image) patch.image = image;
      if (price && !existing?.price) patch.price = price;
      if (Object.keys(patch).length > 0) {
        await supabase.from('short_links').update(patch).eq('code', code);
      }
    } else {
      for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generateCode(6);
        const { error } = await supabase
          .from('short_links')
          .insert({ code: candidate, url, title, image, price });
        if (!error) {
          code = candidate;
          break;
        }
        if (error.code !== '23505') {
          console.error('insert error', error);
          return new Response(JSON.stringify({ error: error.message, short_url: url }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    if (!code) {
      return new Response(JSON.stringify({ short_url: url, error: 'could not generate code' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ code }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
