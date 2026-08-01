import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DealContent {
  seo_title: string;
  meta_description: string;
  body: string;
  faq: { pergunta: string; resposta: string }[];
}

export interface PricePoint {
  price: number;
  captured_at: string;
}

interface Params {
  slug?: string;
  dealId?: string;
  titulo?: string;
  preco?: string;
  categoria?: string;
  loja?: string;
}

export function useDealContent({ slug, dealId, titulo, preco, categoria, loja }: Params) {
  return useQuery({
    queryKey: ["deal-content", slug],
    enabled: Boolean(slug && titulo),
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
    queryFn: async (): Promise<DealContent | null> => {
      const { data, error } = await supabase.functions.invoke("deal-content", {
        body: { slug, dealId, titulo, preco, categoria, loja },
      });
      if (error) {
        console.error("deal-content falhou:", error.message);
        return null;
      }
      return (data as DealContent) ?? null;
    },
  });
}

export function usePriceHistory(dealId?: string) {
  return useQuery({
    queryKey: ["price-history", dealId],
    enabled: Boolean(dealId),
    staleTime: 60 * 60 * 1000,
    queryFn: async (): Promise<PricePoint[]> => {
      const { data, error } = await supabase
        .from("price_history")
        .select("price, captured_at")
        .eq("deal_id", dealId!)
        .order("captured_at", { ascending: true })
        .limit(90);
      if (error) {
        console.error("price_history falhou:", error.message);
        return [];
      }
      return (data ?? []).map((r) => ({
        price: Number(r.price),
        captured_at: r.captured_at as string,
      }));
    },
  });
}
