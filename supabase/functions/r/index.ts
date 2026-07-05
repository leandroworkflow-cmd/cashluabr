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
    const image = (data.image as string | null) || 'https://www.cashlua.com.br/og-image.png';
    const price = data.price as string | null;
    const description = price
      ? `Por apenas R$ ${price}. Aproveite essa oferta selecionada pelo CashLua.`
      : 'Oferta selecionada pelo CashLua. Clique para ver no site da loja.';

    // Detecta crawlers de preview (WhatsApp, Telegram, Facebook, Twitter, etc).
    // Para bots: devolve APENAS as OG tags, sem redirect (senão eles seguem
    // o meta refresh e mostram o preview da página de destino, não a nossa).
    // Para humanos: redireciona imediatamente via HTTP 302.
    const ua = (req.headers.get('user-agent') || '').toLowerCase();
    const isBot = /whatsapp|telegrambot|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|pinterest|skypeuripreview|googlebot|bingbot|embedly|redditbot|vkshare|w3c_validator|preview|bot|crawler|spider/i.test(ua);

    if (!isBot) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: target,
          'Cache-Control': 'no-store',
        },
      });
    }

    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<meta property="og:type" content="product" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:secure_url" content="${escapeHtml(image)}" />
<meta property="og:image:alt" content="${escapeHtml(title)}" />
<meta property="og:url" content="${escapeHtml(target)}" />
<meta property="og:site_name" content="CashLua" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body>${escapeHtml(title)}</body>
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
