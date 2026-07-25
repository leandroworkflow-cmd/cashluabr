import { useQuery } from "@tanstack/react-query";
import { fetchDealsFromSheet } from "@/lib/google-sheets";
import { Deal, FilterType, Category } from "@/lib/types";

const MAX_DEALS_TO_PROCESS = 300;

// Converte "1.299,90" ou "1299.90" em número, de forma tolerante.
function parsePreco(preco: string | undefined): number {
  if (!preco) return 0;
  const cleaned = preco
    .toString()
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(,|$))/g, "") // remove separador de milhar
    .replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

export function useDeals() {
  return useQuery({
    queryKey: ["deals"],
    queryFn: fetchDealsFromSheet,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function filterDeals(
  deals: Deal[],
  filter: FilterType,
  category: Category,
  search: string
): Deal[] {
  let filtered = deals;

  if (category !== "Todos") {
    filtered = filtered.filter((d) => d.categoria === category);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((d) => d.titulo.toLowerCase().includes(q));
  }

  switch (filter) {
    case "recentes":
      filtered = [...filtered].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      break;
    case "menor-preco":
      filtered = [...filtered].sort((a, b) => parsePreco(a.preco) - parsePreco(b.preco));
      break;
    case "maior-preco":
      filtered = [...filtered].sort((a, b) => parsePreco(b.preco) - parsePreco(a.preco));
      break;
  }

  return filtered.slice(0, MAX_DEALS_TO_PROCESS);
}
