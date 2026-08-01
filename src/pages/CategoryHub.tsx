import { useParams } from "react-router-dom";
import { HubLayout } from "@/components/HubLayout";
import { useDeals } from "@/hooks/useDeals";
import { getCategoryHub } from "@/lib/seo-taxonomy";
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

export default CategoryHub;
