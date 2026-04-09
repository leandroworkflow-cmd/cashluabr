import { useState } from "react";
import { Header } from "@/components/Header";
import { FilterBar } from "@/components/FilterBar";
import { DealCard } from "@/components/DealCard";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { useDeals, filterDeals } from "@/hooks/useDeals";
import { FilterType, Category } from "@/lib/types";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("quentes");
  const [category, setCategory] = useState<Category>("Todos");
  const { data: deals, isLoading, error } = useDeals();

  const filtered = deals ? filterDeals(deals, filter, category, search) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header search={search} onSearchChange={setSearch} />

      <main className="flex-1">
        <div className="container py-6 space-y-5">
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
            {filtered.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default Index;
