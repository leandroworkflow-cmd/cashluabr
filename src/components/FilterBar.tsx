import { FilterType, Category, CATEGORIES } from "@/lib/types";

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  category: Category;
  onCategoryChange: (c: Category) => void;
}

// Só critérios verificáveis a partir dos dados reais (data e preço).
const SORTS: { key: FilterType; label: string }[] = [
  { key: "recentes", label: "Mais recentes" },
  { key: "menor-preco", label: "Menor preço" },
  { key: "maior-preco", label: "Maior preço" },
];

export function FilterBar({ filter, onFilterChange, category, onCategoryChange }: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div role="group" aria-label="Ordenar ofertas" className="flex flex-wrap items-center gap-x-1 gap-y-2">
        <span className="mr-2 text-sm text-muted-foreground">Ordenar por</span>
        {SORTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => onFilterChange(s.key)}
            aria-pressed={filter === s.key}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === s.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-label="Filtrar por categoria"
        className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            aria-pressed={category === cat}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              category === cat
                ? "border-foreground bg-foreground font-medium text-background"
                : "border-border bg-card text-foreground hover:border-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
