import { useParams } from "react-router-dom";
import { HubLayout } from "@/components/HubLayout";
import { useDeals } from "@/hooks/useDeals";
import { getStoreBySlug, detectStore } from "@/lib/seo-taxonomy";
import NotFound from "./NotFound";

const StoreHub = () => {
  const { slug } = useParams<{ slug: string }>();
  const store = getStoreBySlug(slug || "");
  const { data: deals, isLoading } = useDeals();

  if (!store) return <NotFound />;

  const filtered = (deals || []).filter(
    (d) => detectStore(d.link)?.slug === store.slug
  );

  return (
    <HubLayout
      title={`Ofertas ${store.name} — Promoções e Cupons de Hoje | CashLua`}
      description={`Promoções da ${store.name} reunidas pelo CashLua, com preço atualizado e link direto para a oferta na loja.`}
      path={`/loja/${store.slug}`}
      h1={`Ofertas da ${store.name}`}
      intro={`Aqui ficam as promoções da ${store.name} que o CashLua encontrou e que continuam ativas. Em lojas grandes, o preço de um mesmo produto muda várias vezes ao dia, então o valor exibido é o do último registro que fizemos — sempre confira o preço final na página da loja antes de fechar a compra, incluindo frete e possíveis cupons aplicáveis no carrinho.`}
      crumbs={[{ name: "Categorias", path: "/categorias" }, { name: store.name }]}
      deals={filtered}
      isLoading={isLoading}
      faq={[
        {
          pergunta: `O CashLua vende os produtos da ${store.name}?`,
          resposta:
            "Não. Somos um agregador de ofertas: reunimos promoções públicas e encaminhamos você para a loja, onde a compra é feita e o atendimento é responsabilidade dela.",
        },
        {
          pergunta: `Por que o preço na ${store.name} está diferente do exibido aqui?`,
          resposta:
            "Preços em marketplaces mudam ao longo do dia. Nossa base é atualizada com frequência, mas o valor que vale é sempre o mostrado na página da loja no momento da compra.",
        },
      ]}
      emptyMessage={`No momento não há ofertas da ${store.name} ativas na nossa base.`}
    />
  );
};

export default StoreHub;
