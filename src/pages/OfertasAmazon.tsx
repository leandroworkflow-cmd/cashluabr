import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2, Tag, Flame, MessageCircle } from "lucide-react";
import { shortenUrl } from "@/lib/shorten";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AdSlot } from "@/components/AdSlot";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";

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
  total: number;
  fetchedAt: string;
}

const OfertasAmazon = () => {
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch, isFetching } = useQuery<ScrapeResponse>({
    queryKey: ["amazon-ofertas"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-amazon");
      if (error) throw error;
      return data as ScrapeResponse;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const ofertas = data?.ofertas || [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ofertas;
    return ofertas.filter((o) => o.titulo.toLowerCase().includes(term));
  }, [ofertas, search]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Ofertas do Dia Amazon - CashLua"
        description="As melhores ofertas do dia da Amazon Brasil, atualizadas em tempo real. Promoções com descontos imperdíveis."
        path="/ofertas-amazon"
      />
      <Header search={search} onSearchChange={setSearch} />

      <main className="flex-1">
        <div className="container py-6 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2">
                <Flame className="h-7 w-7 text-hot animate-flame-pulse" />
                Ofertas do Dia - Amazon
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Promoções raspadas em tempo real da página Gold Box da Amazon Brasil.
              </p>
              {data?.fetchedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Atualizado: {new Date(data.fetchedAt).toLocaleString("pt-BR")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-lg bg-primary px-4 py-2 font-heading text-sm font-bold text-primary-foreground shadow-sm hover:brightness-110 disabled:opacity-60"
            >
              {isFetching ? "Atualizando..." : "Atualizar"}
            </button>
          </div>

          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_TOP} />

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Buscando ofertas na Amazon... (pode levar alguns segundos)
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Erro ao buscar ofertas: {(error as Error).message}</p>
              <button onClick={() => refetch()} className="mt-3 text-primary underline text-sm">
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Nenhuma oferta encontrada no momento.</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((o) => (
              <article
                key={o.id}
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
                <div className="p-3 flex flex-col flex-1 gap-2">
                  <h2 className="text-sm font-heading font-semibold leading-snug line-clamp-3 text-card-foreground">
                    {o.titulo}
                  </h2>
                  <div className="mt-auto">
                    {o.preco_original && (
                      <span className="text-xs text-muted-foreground line-through block">
                        R$ {o.preco_original}
                      </span>
                    )}
                    <span className="text-lg font-heading font-extrabold text-foreground">
                      R$ {o.preco}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href={o.link}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-heading font-bold text-xs px-3 py-2 rounded-lg hover:brightness-110 transition-all"
                    >
                      Ver na Amazon
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        const short = await shortenUrl(o.link, {
                          title: o.titulo,
                          image: o.imagem,
                          price: o.preco,
                        });
                        const text = `🔥 Oferta Amazon: ${o.titulo} por R$ ${o.preco}! 👉 ${short}`;
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(text)}`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="inline-flex items-center justify-center gap-1.5 text-white font-heading font-bold text-xs px-3 py-2 rounded-lg hover:brightness-110 transition-all"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle className="h-3 w-3" />
                      Compartilhar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM} layout="rectangle" />
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default OfertasAmazon;
