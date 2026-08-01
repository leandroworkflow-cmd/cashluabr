import { useParams, Link } from "react-router-dom";
import { HubLayout } from "@/components/HubLayout";
import { useDeals } from "@/hooks/useDeals";
import { CATEGORY_HUBS, getCategoryHub } from "@/lib/seo-taxonomy";
import NotFound from "./NotFound";

const CategoryHub = () => {
  const { slug } = useParams<{ slug: string }>();
  const hub = getCategoryHub(slug || "");
  const { data: deals, isLoading } = useDeals();

  if (!hub) return <NotFound />;

  const filtered = (deals || []).filter(hub.match);

  return (
    <HubLayout
      title={hub.title}
      description={hub.description}
      path={`/categoria/${hub.slug}`}
      h1={hub.h1}
      intro={hub.intro}
      crumbs={[{ name: "Categorias", path: "/categorias" }, { name: hub.name }]}
      deals={filtered}
      isLoading={isLoading}
      faq={hub.faq}
    />
  );
};

export const CategoryIndex = () => {
  return (
    <HubLayout
      title="Categorias de Ofertas — Todas as Promoções por Tema | CashLua"
      description="Navegue pelas promoções do CashLua por categoria: celulares, notebooks, eletrodomésticos, games, moda, beleza, esportes e ferramentas."
      path="/categorias"
      h1="Ofertas por categoria"
      intro="Organizamos as promoções ativas do CashLua por tema para facilitar a busca. Cada categoria reúne as ofertas encontradas nas lojas parceiras e traz orientações sobre o que observar antes de comprar naquele tipo de produto."
      crumbs={[{ name: "Categorias" }]}
      deals={[]}
      emptyMessage=""
    >
      {null}
    </HubLayout>
  );
};

export const CategoryList = () => (
  <div className="container py-6">
    {CATEGORY_HUBS.map((h) => (
      <Link key={h.slug} to={`/categoria/${h.slug}`}>
        {h.name}
      </Link>
    ))}
  </div>
);

export default CategoryHub;
