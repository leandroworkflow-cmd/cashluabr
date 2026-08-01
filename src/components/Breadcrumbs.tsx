import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  path?: string;
}

const SITE_URL = "https://www.cashlua.com.br";

export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const all: Crumb[] = [{ name: "Início", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        {all.map((item, i) => (
          <li key={`${item.name}-${i}`} className="flex items-center gap-1">
            {item.path && i < all.length - 1 ? (
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.name}
              </Link>
            ) : (
              <span className="text-foreground/80 line-clamp-1">{item.name}</span>
            )}
            {i < all.length - 1 && <ChevronRight className="h-3 w-3 opacity-60" />}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export function breadcrumbJsonLd(items: Crumb[]) {
  const all: Crumb[] = [{ name: "Início", path: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  };
}
