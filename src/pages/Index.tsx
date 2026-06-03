import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { NetshoesBanner } from "@/components/NetshoesBanner";
import { PartnerStores } from "@/components/PartnerStores";
import { FilterBar } from "@/components/FilterBar";
import { DealCard } from "@/components/DealCard";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AdSlot } from "@/components/AdSlot";
import { SEO } from "@/components/SEO";
import { useDeals, filterDeals } from "@/hooks/useDeals";
import { FilterType, Category } from "@/lib/types";
import { Loader2 } from "lucide-react";


const DEALS_PAGE_SIZE = 24;

const Index = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("quentes");
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
          url: "https://cashluabr.lovable.app/",
        }}
      />
      <Header search={search} onSearchChange={setSearch} />
      <WelcomeBanner />


      <main className="flex-1">
        <div className="container py-6 space-y-5">
          {/* Banner Afiliado - Netshoes */}
          <NetshoesBanner />

          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
              🔥 Melhores Ofertas de Hoje
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              As promoções mais quentes selecionadas pela comunidade
            </p>
          </div>

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
                {/* AdSense a cada 5 ofertas */}
                {(index + 1) % 5 === 0 && index < visibleDeals.length - 1 && (
                  <div className="mt-3">
                    <AdSlot />
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
          <AdSlot />
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
