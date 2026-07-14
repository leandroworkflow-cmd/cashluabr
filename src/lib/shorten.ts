import { supabase } from "@/integrations/supabase/client";

export interface ShortenMeta {
  title?: string;
  image?: string;
  price?: string;
  // Caminho da página do produto no próprio site (ex: "/oferta/nome-abc123").
  // Guardado no encurtador para que o link compartilhado abra essa página
  // em vez de ir direto para a loja.
  pageUrl?: string;
}

// Domínio público do site. O link compartilhado (WhatsApp, Telegram etc.)
// precisa cair aqui, e não direto no domínio do Supabase, para que o preview
// mostre "www.cashlua.com.br" em vez de "xxxxx.supabase.co".
// Isso funciona porque o vercel.json faz um rewrite (proxy) de /r/:code
// para a edge function `r` do Supabase, sem mudar a URL visível.
const SITE_URL = "https://www.cashlua.com.br";

// Encurta URLs usando o encurtador próprio (tabela short_links + edge function).
// Retorna a URL pública da função `r`, que serve OG tags (preview com imagem
// em Telegram/WhatsApp/Facebook) e redireciona para a URL original.
//
// IMPORTANTE: o link final precisa apontar para a EDGE FUNCTION do Supabase
// (.../functions/v1/r/<code>), e não para a rota /r/:code do próprio site
// React. A rota do site é uma SPA — ela só decide o redirecionamento depois
// que o JavaScript carrega no navegador, então robôs de preview (WhatsApp,
// Telegram, Facebook) não veem nem a imagem nem o título do produto, porque
// eles não executam JavaScript, só leem o HTML puro da primeira resposta.
// A edge function `r` já devolve esse HTML puro com as tags og:image,
// og:title etc prontas, então é nela que o link precisa cair.
export async function shortenUrl(url: string, meta?: ShortenMeta): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("shorten", {
      body: { url, ...(meta || {}) },
    });
    if (error) return url;

    const code = data?.code as string | undefined;
    if (!code) return (data?.short_url as string) || url;

    return `${SITE_URL}/r/${code}`;
  } catch {
    return url;
  }
}
