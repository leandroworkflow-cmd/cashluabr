import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, Flame, TrendingDown, Trophy } from "lucide-react";
import { DealCard } from "@/components/DealCard";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { useDeals } from "@/hooks/useDeals";
import { Deal } from "@/lib/types";
import {
  dealsByClicks,
  dealsWithFallingPrices,
  fetchClickStats,
  fetchPriceDeltas,
  priceRangeLabel,
  topByDiscount,
  topRecent,
  type ClickStat,
  type PriceDelta,
} from "@/lib/trends";

function Section({
  id,
  icon,
  title,
  description,
  deals,
  emptyText,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  deals: Deal[];
  emptyText: string;
}) {
  if (!deals.length) return null;

  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-primary mt-0.5">{icon}</span>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {deals.length ? (
        <div className="grid grid-cols-1 gap-4">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      )}
    </section>
  );
}

export default function Tendencias() {
  const { data: deals, isLoading } = useDeals();
  const [deltas, setDeltas] = useState<PriceDelta[]>([]);
  const [stats, setStats] = useState<ClickStat[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchPriceDeltas(), fetchClickStats()]).then(([d, c]) => {
      if (!alive) return;
      setDeltas(d);
      setStats(c);
    });
    return () => {
      alive = false;
    };
  }, []);

  const pool = deals ?? [];
  const discount = topByDiscount(pool, 12);
  const falling = dealsWithFallingPrices(pool, deltas, 12);
  const recent = topRecent(pool, 12);
  const clicked = dealsByClicks(pool, stats, 12);

  const range = priceRangeLabel(pool);

  return (
    <>
      <SEO
        title="Tendências de ofertas hoje | CashLua"
        description={`As ofertas mais quentes de hoje no Brasil: maiores descontos, produtos que caíram de preço e as mais clicadas. ${range ? `Preços ${range}.` : ""}`}
        path="/tendencias"
      />

      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ name: "Tendências" }]} />

        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            Tendências de ofertas de hoje
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Esta página é montada com o que está acontecendo agora na base do CashLua:
            os maiores descontos informados pelas lojas, os produtos que realmente
            ficaram mais baratos nas nossas leituras de preço e as ofertas que mais
            receberam clique. Nada aqui é número de vitrine — se um produto não caiu
            de preço, ele não aparece na lista de queda.
          </p>
          <nav className="mt-4 flex flex-wrap gap-2 text-xs">
            {[
              ["#maiores-descontos", "Maiores descontos"],
              ["#precos-caindo", "Preços caindo"],
              ["#mais-clicadas", "Mais clicadas"],
              ["#novas", "Novas da base"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-border px-3 py-1 hover:bg-secondary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando as tendências…</p>
        ) : (
          <>
            <Section
              id="maiores-descontos"
              icon={<Flame className="h-5 w-5" />}
              title="Maiores descontos agora"
              description="Ofertas com o maior percentual de desconto declarado pela loja."
              deals={discount}
              emptyText="Nenhuma oferta com desconto informado no momento."
            />

            <AdSlot className="my-8" />

            <Section
              id="precos-caindo"
              icon={<TrendingDown className="h-5 w-5" />}
              title="Preços caindo"
              description="Produtos que estavam mais caros na primeira leitura e hoje custam menos."
              deals={falling}
              emptyText="Ainda não há histórico suficiente para apontar quedas de preço."
            />

            <Section
              id="mais-clicadas"
              icon={<Trophy className="h-5 w-5" />}
              title="Mais clicadas"
              description="As ofertas que mais receberam clique pelos links compartilhados do CashLua."
              deals={clicked}
              emptyText="Sem cliques registrados ainda — essa lista aparece assim que as ofertas começarem a ser compartilhadas."
            />

            <AdSlot className="my-8" />

            <Section
              id="novas"
              icon={<ArrowDownRight className="h-5 w-5" />}
              title="Novas na base"
              description="O que acabou de entrar, do canal e das lojas parceiras."
              deals={recent}
              emptyText="Nenhuma oferta nova no momento."
            />
          </>
        )}

        <div className="mt-10 rounded-lg border border-border bg-secondary/40 p-5">
          <h2 className="text-base font-semibold">Como ler esta página</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Desconto é o que a loja declara; queda de preço é o que a gente mede.
            Quando os dois batem, costuma ser oferta de verdade. Antes de fechar a
            compra, abra a página do produto e confira o histórico de preço e o
            link da loja.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/blog" className="text-primary font-medium hover:underline">
              Ler o artigo de hoje no blog
            </Link>
            <Link to="/categorias" className="text-primary font-medium hover:underline">
              Ver todas as categorias
            </Link>
            <Link to="/ofertas-shopee" className="text-primary font-medium hover:underline">
              Ofertas da Shopee
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
