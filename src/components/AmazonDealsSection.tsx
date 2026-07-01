import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, Loader2, Tag, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AmazonDeal {
  id: string;
  titulo: string;
  preco: string;
  preco_original: string | null;
  desconto: string | null;
  imagem: string;
  link: string;
}

interface ScrapeResponse {
  ofertas: AmazonDeal[];
  fetchedAt: string;
}

interface Props {
  limit?: number;
}

export function AmazonDealsSection({ limit = 8 }: Props) {
  const { data, isLoading, error } = useQuery<ScrapeResponse>({
    queryKey: ["amazon-ofertas-home"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-amazon");
      if (error) throw error;
      return data as ScrapeResponse;
    },
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const ofertas = (data?.ofertas || []).slice(0, limit);

  return (
    <section aria-label="Ofertas Amazon" className="space-y-3">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-foreground flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold"
              style={{ backgroundColor: "#131A22", color: "#FF9900" }}
            >
              amazon
            </span>
            Ofertas do Dia
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Selecionadas em tempo real da Amazon Brasil
          </p>
        </div>
        <Link
          to="/ofertas-amazon"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 font-heading text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110 transition-all"
        >
          Ver todas
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <p className="text-sm text-muted-foreground py-4">
          Não foi possível carregar as ofertas Amazon agora.
        </p>
      )}

      {!isLoading && !error && ofertas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ofertas.map((o) => (
            <a
              key={o.id}
              href={o.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group bg-card rounded-lg border border-border hover:shadow-lg transition-all overflow-hidden flex flex-col"
            >
              <div className="aspect-square bg-secondary/30 flex items-center justify-center p-3 overflow-hidden relative">
                {o.imagem ? (
                  <img
                    src={o.imagem}
                    alt={o.titulo}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground">Sem imagem</div>
                )}
                {o.desconto && (
                  <span className="absolute top-2 left-2 bg-hot text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    -{o.desconto}%
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1 gap-1">
                <h3 className="text-xs sm:text-sm font-heading font-semibold leading-snug line-clamp-2 text-card-foreground">
                  {o.titulo}
                </h3>
                <div className="mt-auto pt-1">
                  {o.preco_original && (
                    <span className="text-[10px] text-muted-foreground line-through block">
                      R$ {o.preco_original}
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-base font-heading font-extrabold text-foreground">
                      R$ {o.preco}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
