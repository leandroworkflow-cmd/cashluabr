import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { NetshoesBanner } from "@/components/NetshoesBanner";
import { PartnerStores } from "@/components/PartnerStores";
import { AmazonDealsSection } from "@/components/AmazonDealsSection";
import { FilterBar } from "@/components/FilterBar";
import { DealCard } from "@/components/DealCard";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { SEO } from "@/components/SEO";
import { useDeals, filterDeals } from "@/hooks/useDeals";
import { FilterType, Category } from "@/lib/types";
import { Loader2 } from "lucide-react";


const DEALS_PAGE_SIZE = 24;

const Index = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("recentes");
  const [category, setCategory] = useState<Category>("Todos");
  const [visibleCount, setVisibleCount] = useState(DEALS_PAGE_SIZE);
  const { data: deals, isLoading, error } = useDeals();

  const filtered = useMemo(
    () => (deals ? filterDeals(deals, filter, category, search) : []),
    [deals, filter, category, search]
  );
  const visibleDeals = filtered.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(DEALS_PAGE_SIZE);
  }, [filter, category, search]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="CashLua - Promoções, Cupons e Ofertas do Dia"
        description="As melhores promoções, cupons de desconto e ofertas do Brasil. Ofertas quentes selecionadas pela comunidade CashLua, atualizadas diariamente."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Melhores Ofertas de Hoje",
          description: "Promoções e cupons selecionados pela comunidade CashLua.",
          url: "https://www.cashlua.com.br/",
        }}
      />
      <Header search={search} onSearchChange={setSearch} />
      <HeroBanner />
      <WelcomeBanner />


      <main className="flex-1">
        <div className="container py-6 space-y-5">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
                Melhores ofertas e cupons de hoje
              </h1>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Reunimos preços publicados por lojas parceiras para facilitar sua comparação. Confira valor, frete e disponibilidade no site da loja antes de comprar.
              </p>
            </div>
            <a
              href="/ofertas-do-dia"
              className="rounded-lg bg-hot px-4 py-2 font-heading text-sm font-bold text-hot-foreground shadow-sm hover:brightness-110 transition-all whitespace-nowrap"
            >
              Ofertas do Dia ML
            </a>
          </div>

          {/* Banner Afiliado - Netshoes */}
          <NetshoesBanner />

          {/* Lojas parceiras */}
          <PartnerStores />

          {/* Ofertas Amazon em destaque */}
          <AmazonDealsSection limit={8} />

          {/* AdSense - Topo */}
          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_TOP} />

          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            category={category}
            onCategoryChange={setCategory}
          />

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Erro ao carregar ofertas. Tente novamente.</p>
            </div>
          )}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p>Nenhuma oferta encontrada.</p>
            </div>
          )}

          <div className="space-y-3">
            {visibleDeals.map((deal, index) => (
              <div key={deal.id}>
                <DealCard deal={deal} />
                {/* Mantém publicidade claramente separada e em menor volume que o conteúdo. */}
                {(index + 1) % 8 === 0 && index < visibleDeals.length - 1 && (
                  <div className="mt-3">
                    <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_FEED} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {visibleDeals.length < filtered.length && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + DEALS_PAGE_SIZE)}
                className="rounded-lg bg-primary px-5 py-3 font-heading text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110"
              >
                Carregar mais ofertas
              </button>
            </div>
          )}

          {/* AdSense - Final */}
          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM} layout="rectangle" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
