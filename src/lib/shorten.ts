import { supabase } from "@/integrations/supabase/client";

// Encurta URLs via Bitly (edge function). Fallback: URL original.
export async function shortenUrl(url: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke("shorten", {
      body: { url },
    });
    if (error) return url;
    return (data?.short_url as string) || url;
  } catch {
    return url;
  }
}
