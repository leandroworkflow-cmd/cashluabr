import { useQuery } from "@tanstack/react-query";
import { fetchDealsFromSheet } from "@/lib/google-sheets";
import { Deal, FilterType, Category } from "@/lib/types";

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
  let filtered = [...deals];

  if (category !== "Todos") {
    filtered = filtered.filter((d) => d.categoria === category);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((d) => d.titulo.toLowerCase().includes(q));
  }

  switch (filter) {
    case "quentes":
      filtered.sort((a, b) => (b.temperatura || 0) - (a.temperatura || 0));
      break;
    case "recentes":
      filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      break;
    case "comentadas":
      filtered.sort((a, b) => (b.comentarios || 0) - (a.comentarios || 0));
      break;
  }

  return filtered;
}
