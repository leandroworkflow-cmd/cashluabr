import { supabase } from "@/integrations/supabase/client";

// Encurta URLs usando o encurtador próprio (tabela short_links + edge function).
// Retorna https://<dominio-do-site>/r/<code>. Fallback: URL original.
export async function shortenUrl(url: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("shorten", {
      body: { url },
    });
    if (error) return url;
    const code = data?.code as string | undefined;
    if (!code) return (data?.short_url as string) || url;

    // Usa o domínio público em produção, ou o origin atual em preview/local
    const host = window.location.hostname;
    const origin =
      host === "localhost" || host.endsWith(".lovable.app") && host.includes("preview")
        ? window.location.origin
        : "https://cashluabr.lovable.app";
    return `${origin}/r/${code}`;
  } catch {
    return url;
  }
}
