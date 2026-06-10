import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink,
  Loader2,
  Tag,
  Flame,
  ChevronLeft,
  ChevronRight,
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
  Flame as FireIcon,
  Layers,
  MessageCircle,
} from "lucide-react";
import { shortenUrl } from "@/lib/shorten";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AdSlot } from "@/components/AdSlot";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface MLDeal {
  id: string;
  titulo: string;
  preco: string;
  preco_original: string | null;
  desconto: string | null;
  imagem: string;
  link: string;
}

interface ScrapeResponse {
  ofertas: MLDeal[];
  total: number;
  fetchedAt: string;
}

function parsePrice(value: string): number {
  const cleaned = value
    .replace(/[^\d,\.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return parseFloat(cleaned) || 0;
}

function parseDiscount(value: string | null): number {
  if (!value) return 0;
  const num = parseInt(value.replace(/\D/g, ""), 10);
  return isNaN(num) ? 0 : num;
}

type SortOption = "recentes" | "baratos" | "quentes";

const OfertasDoDia = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recentes");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(24);

  const { data, isLoading, error, refetch, isFetching } = useQuery<ScrapeResponse>({
    queryKey: ["ml-ofertas-dia"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-mercadolivre");
      if (error) throw error;
      return data as ScrapeResponse;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allOfertas = data?.ofertas || [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allOfertas;
    return allOfertas.filter((o) => o.titulo.toLowerCase().includes(term));
  }, [allOfertas, search]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sortBy) {
      case "baratos":
        copy.sort((a, b) => parsePrice(a.preco) - parsePrice(b.preco));
        break;
      case "quentes":
        copy.sort(
          (a, b) => parseDiscount(b.desconto) - parseDiscount(a.desconto)
        );
        break;
      case "recentes":
      default:
        break;
    }
    return copy;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const paginated = sorted.slice(startIndex, startIndex + perPage);

  const goToPage = useCallback(
    (p: number) => {
      const next = Math.max(1, Math.min(p, totalPages));
      setPage(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  const handleSortChange = (val: string) => {
    setSortBy(val as SortOption);
    setPage(1);
  };

  const handlePerPageChange = (val: string) => {
    setPerPage(Number(val));
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Ofertas do Dia Mercado Livre - CashLua"
        description="As melhores ofertas do dia direto do Mercado Livre, atualizadas em tempo real. Promoções selecionadas com descontos imperdíveis."
        path="/ofertas-do-dia"
      />
      <Header search={search} onSearchChange={setSearch} />

      <main className="flex-1">
        <div className="container py-6 space-y-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2">
                <Flame className="h-7 w-7 text-hot animate-flame-pulse" />
                Ofertas do Dia - Mercado Livre
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Promoções raspadas em tempo real da página oficial de ofertas.
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

          {!isLoading && !error && filtered.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Ordenar:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[170px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recentes">
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Mais recentes
                      </span>
                    </SelectItem>
                    <SelectItem value="baratos">
                      <span className="flex items-center gap-2">
                        <ArrowDownAZ className="h-3.5 w-3.5" />
                        Mais baratos
                      </span>
                    </SelectItem>
                    <SelectItem value="quentes">
                      <span className="flex items-center gap-2">
                        <FireIcon className="h-3.5 w-3.5" />
                        Mais quentes
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Exibir:</span>
                <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                  <SelectTrigger className="w-[80px] h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">por página</span>
              </div>

              <span className="text-sm text-muted-foreground ml-auto">
                {filtered.length} oferta{filtered.length !== 1 ? "s" : ""} encontrada
                {filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Buscando ofertas no Mercado Livre... (pode levar alguns segundos)
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Erro ao buscar ofertas: {(error as Error).message}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 text-primary underline text-sm"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && !error && paginated.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Nenhuma oferta encontrada no momento.</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {paginated.map((o, idx) => (
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
                  <a
                    href={o.link}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-heading font-bold text-xs px-3 py-2 rounded-lg hover:brightness-110 transition-all"
                  >
                    Ver no Mercado Livre
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                {(idx + 1) % 8 === 0 && (
                  <div className="col-span-full">
                    <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_FEED} />
                  </div>
                )}
              </article>
            ))}
          </div>

          {!isLoading && !error && totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage <= 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === safePage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(p)}
                    className="min-w-[36px]"
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Página {safePage} de {totalPages} ({sorted.length} ofertas)
              </p>
            </div>
          )}

          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM} layout="rectangle" />
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default OfertasDoDia;
