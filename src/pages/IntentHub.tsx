import { useLocation } from "react-router-dom";
import { HubLayout } from "@/components/HubLayout";
import { useDeals } from "@/hooks/useDeals";
import { getIntentHub } from "@/lib/seo-taxonomy";
import NotFound from "./NotFound";

const IntentHubPage = () => {
  const { pathname } = useLocation();
  const hub = getIntentHub(pathname.replace(/\/$/, ""));
  const { data: deals, isLoading } = useDeals();

  if (!hub) return <NotFound />;

  const filtered = hub.apply(deals || []);

  return (
    <HubLayout
      title={hub.title}
      description={hub.description}
      path={hub.path}
      h1={hub.h1}
      intro={hub.intro}
      crumbs={[{ name: "Categorias", path: "/categorias" }, { name: hub.h1 }]}
      deals={filtered}
      isLoading={isLoading}
      faq={[
        {
          pergunta: "Com que frequência esta lista é atualizada?",
          resposta:
            "A lista é montada em tempo real a partir da base de ofertas do CashLua, que recebe novas promoções todos os dias. Cada visita pode mostrar uma seleção diferente.",
        },
        {
          pergunta: "Os preços exibidos incluem frete?",
          resposta:
            "Não. Os valores são os do produto na loja. O frete varia por CEP e por vendedor, e deve ser conferido no carrinho antes de finalizar a compra.",
        },
      ]}
    />
  );
};

export default IntentHubPage;
