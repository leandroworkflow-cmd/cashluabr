import { createClient } from 'npm:@supabase/supabase-js@2';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function notFound(): Response {
  return new Response('Link não encontrado', { status: 404 });
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    // path: /functions/v1/r/<code>  ou  /r/<code>
    const parts = url.pathname.split('/').filter(Boolean);
    const code = parts[parts.length - 1];
    if (!code || code === 'r') return notFound();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase
      .from('short_links')
      .select('url, title, image, price')
      .eq('code', code)
      .maybeSingle();

    if (error || !data?.url) return notFound();

    // Incrementa cliques (não bloqueia)
    supabase.rpc('increment_short_link_click', { _code: code }).then(() => {});

    const target = data.url as string;
    const title = (data.title as string | null) || 'Oferta CashLua';
    const image = (data.image as string | null) || 'https://cashluabr.lovable.app/og-image.png';
    const price = data.price as string | null;
    const description = price
      ? `Por apenas R$ ${price}. Aproveite essa oferta selecionada pelo CashLua.`
      : 'Oferta selecionada pelo CashLua. Clique para ver no site da loja.';

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="product" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${escapeHtml(target)}" />
<meta property="og:site_name" content="CashLua" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}" />
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body style="font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0b0b0c;color:#fff;">
<div style="text-align:center;padding:24px;">
<p style="margin:0 0 12px;font-size:18px;font-weight:700;">Redirecionando para a oferta...</p>
<p style="margin:0;font-size:14px;opacity:.7;">Se não for redirecionado, <a style="color:#fbbf24;" href="${escapeHtml(target)}">clique aqui</a>.</p>
</div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (e) {
    console.error('r function error', e);
    return new Response('Erro', { status: 500 });
  }
});
