import { supabase } from "@/integrations/supabase/client";

export interface ShortenMeta {
  title?: string;
  image?: string;
  price?: string;
}

// Encurta URLs usando o encurtador próprio (tabela short_links + edge function).
// Retorna a URL pública da função `r`, que serve OG tags (preview com imagem
// em Telegram/WhatsApp/Facebook) e redireciona para a URL original.
export async function shortenUrl(url: string, meta?: ShortenMeta): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("shorten", {
      body: { url, ...(meta || {}) },
    });
    if (error) return url;
    const code = data?.code as string | undefined;
    if (!code) return (data?.short_url as string) || url;

    const supaUrl = import.meta.env.VITE_SUPABASE_URL as string;
    return `${supaUrl}/functions/v1/r/${code}`;
  } catch {
    return url;
  }
}
