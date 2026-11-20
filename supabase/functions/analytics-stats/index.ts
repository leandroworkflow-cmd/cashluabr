import { createClient } from 'npm:@supabase/supabase-js@2';

// Entrega o resumo do painel. Protegida por uma chave (secret ANALYTICS_ADMIN_KEY).

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-admin-key',
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

async function sha256(s: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  try {
    const expected = Deno.env.get('ANALYTICS_ADMIN_KEY');
    if (!expected || expected.length < 16) {
      return json({ error: 'ANALYTICS_ADMIN_KEY não configurada (mínimo 16 caracteres).' }, 500);
    }

    const provided = req.headers.get('x-admin-key') || '';
    if (!(await safeEqual(provided, expected))) {
      await new Promise((r) => setTimeout(r, 600)); // freia tentativa de força bruta
      return json({ error: 'Chave inválida.' }, 401);
    }

    const daysParam = Number(new URL(req.url).searchParams.get('days') || '7');
    const days = [1, 7, 30, 90].includes(daysParam) ? daysParam : 7;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data, error } = await supabase.rpc('analytics_summary', { _days: days });
    if (error) {
      console.error('analytics_summary', error.message);
      return json({ error: 'Erro ao consultar os dados.' }, 500);
    }
    return json(data);
  } catch (e) {
    console.error('analytics-stats error', e);
    return json({ error: 'Erro interno.' }, 500);
  }
});
