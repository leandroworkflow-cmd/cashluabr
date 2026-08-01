import { useParams } from "react-router-dom";
import { HubLayout } from "@/components/HubLayout";
import { useDeals } from "@/hooks/useDeals";
import { getBrandBySlug, detectBrand } from "@/lib/seo-taxonomy";
import NotFound from "./NotFound";

const BrandHub = () => {
  const { slug } = useParams<{ slug: string }>();
  const brand = getBrandBySlug(slug || "");
  const { data: deals, isLoading } = useDeals();

  if (!brand) return <NotFound />;

  const filtered = (deals || []).filter((d) => detectBrand(d.titulo) === brand);

  return (
    <HubLayout
      title={`${brand} em Promoção — Ofertas e Descontos | CashLua`}
      description={`Promoções de produtos ${brand} encontradas nas lojas parceiras do CashLua, com preço atualizado e link direto para a oferta.`}
      path={`/marca/${slug}`}
      h1={`Ofertas ${brand}`}
      intro={`Esta página reúne todas as promoções de produtos ${brand} que estão ativas agora na base do CashLua. Antes de comprar produtos de marca em marketplaces, confira se o vendedor é a loja oficial ou um revendedor autorizado — isso costuma fazer diferença na garantia e na troca. Também vale comparar o mesmo modelo em mais de uma loja: em marcas populares, a diferença de preço entre vendedores no mesmo dia pode passar de 20%.`}
      crumbs={[{ name: "Categorias", path: "/categorias" }, { name: brand }]}
      deals={filtered}
      isLoading={isLoading}
      faq={[
        {
          pergunta: `Como saber se um produto ${brand} é original?`,
          resposta:
            "Compre de lojas oficiais ou vendedores com boa reputação dentro do marketplace, confira se a embalagem e a nota fiscal são descritas no anúncio e desconfie de preços muito abaixo da média do mercado.",
        },
        {
          pergunta: `A garantia ${brand} vale para compras online?`,
          resposta:
            "Sim, desde que o produto tenha nota fiscal brasileira e seja da versão nacional. Produtos importados por terceiros geralmente têm garantia apenas do vendedor.",
        },
      ]}
      emptyMessage={`No momento não há ofertas ${brand} ativas na nossa base. Novas promoções entram todos os dias.`}
    />
  );
};

export default BrandHub;
