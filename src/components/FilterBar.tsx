import { Flame, Clock, MessageCircle } from "lucide-react";
import { FilterType, Category, CATEGORIES } from "@/lib/types";

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  category: Category;
  onCategoryChange: (c: Category) => void;
}

const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
  { key: "quentes", label: "Mais Quentes", icon: <Flame className="h-4 w-4" /> },
  { key: "recentes", label: "Mais Recentes", icon: <Clock className="h-4 w-4" /> },
  { key: "comentadas", label: "Comentadas", icon: <MessageCircle className="h-4 w-4" /> },
];

export function FilterBar({ filter, onFilterChange, category, onCategoryChange }: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Filter tabs */}
      <div className="flex gap-1 bg-card rounded-lg p-1 border border-border overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              category === cat
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
