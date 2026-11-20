import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { HomeIntro } from "@/components/HomeIntro";
import { PartnerStores } from "@/components/PartnerStores";
import { AmazonDealsSection } from "@/components/AmazonDealsSection";
import { GuidesTeaser } from "@/components/GuidesTeaser";
import { FilterBar } from "@/components/FilterBar";
import { DealGrid } from "@/components/DealGrid";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { SEO } from "@/components/SEO";
import { useDeals, filterDeals } from "@/hooks/useDeals";
import { FilterType, Category } from "@/lib/types";
import { ADSENSE_SLOTS } from "@/lib/adsense";

const DEALS_PAGE_SIZE = 24;

const Index = () => {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [filter, setFilter] = useState<FilterType>("recentes");
  const [category, setCategory] = useState<Category>("Todos");
  const [visibleCount, setVisibleCount] = useState(DEALS_PAGE_SIZE);
  const { data: deals, isLoading, error } = useDeals();

  // Busca vinda de outra página (/?q=termo)
  useEffect(() => {
    setSearch(params.get("q") ?? "");
  }, [params]);

  const filtered = useMemo(
    () => (deals ? filterDeals(deals, filter, category, search) : []),
    [deals, filter, category, search]
  );
  const visibleDeals = filtered.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(DEALS_PAGE_SIZE);
  }, [filter, category, search]);

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="CashLua - Promoções, Cupons e Ofertas do Dia"
        description="As melhores promoções, cupons de desconto e ofertas do Brasil. Ofertas de Amazon, Shopee, Mercado Livre e mais, atualizadas ao longo do dia."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Melhores Ofertas de Hoje",
          description: "Promoções e cupons publicados por lojas e organizados pelo CashLua.",
          url: "https://www.cashlua.com.br/",
        }}
      />
      <Header search={search} onSearchChange={setSearch} />
      <HomeIntro total={deals?.length} />

      <main className="flex-1">
        <div className="container space-y-14 py-10">
          <section id="ofertas" aria-labelledby="titulo-ofertas" className="scroll-mt-24 space-y-5">
            <h2 id="titulo-ofertas" className="font-heading text-xl font-extrabold sm:text-2xl">
              {search ? `Resultados para “${search}”` : "Ofertas de hoje"}
            </h2>

            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              category={category}
              onCategoryChange={setCategory}
            />

            {isLoading && (
              <div className="flex items-center justify-center py-20" role="status">
                <Loader2 className="h-8 w-8 animate-spin text-foreground" aria-label="Carregando ofertas" />
              </div>
            )}

            {error && (
              <p className="py-16 text-center text-muted-foreground">
                Não foi possível carregar as ofertas agora. Atualize a página em alguns instantes.
              </p>
            )}

            {!isLoading && !error && filtered.length === 0 && (
              <p className="py-16 text-center text-muted-foreground">
                Nenhuma oferta encontrada para esses filtros. Tente outra categoria ou limpe a busca.
              </p>
            )}

            {visibleDeals.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Mostrando {visibleDeals.length} de {filtered.length} ofertas
                </p>
                <DealGrid deals={visibleDeals} />
              </>
            )}

            {visibleDeals.length < filtered.length && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + DEALS_PAGE_SIZE)}
                  className="rounded-md border border-foreground px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Carregar mais ofertas
                </button>
              </div>
            )}
          </section>

          <AdSlot slot={ADSENSE_SLOTS.bottom} layout="rectangle" />

          <AmazonDealsSection limit={8} />

          <GuidesTeaser />

          <PartnerStores />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
