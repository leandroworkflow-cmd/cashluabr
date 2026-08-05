import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { AdSlot } from "@/components/AdSlot";
import { DealCard } from "@/components/DealCard";
import { Breadcrumbs, breadcrumbJsonLd, Crumb } from "@/components/Breadcrumbs";
import { Deal } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PAGE_SIZE = 24;

interface Props {
  title: string;
  description: string;
  path: string;
  h1: string;
  intro: string;
  crumbs: Crumb[];
  deals: Deal[];
  isLoading?: boolean;
  faq?: { pergunta: string; resposta: string }[];
  emptyMessage?: string;
}

export const HubLayout = ({
  title,
  description,
  path,
  h1,
  intro,
  crumbs,
  deals,
  isLoading,
  faq = [],
  emptyMessage = "Nenhuma oferta ativa nesta seção no momento. Volte em algumas horas — a base é atualizada diariamente.",
}: Props) => {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const visibleDeals = useMemo(() => deals.slice(0, visible), [deals, visible]);

  const jsonLd: Record<string, unknown>[] = [
    breadcrumbJsonLd(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: h1,
      description,
      url: `https://www.cashlua.com.br${path}`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: deals.length,
        itemListElement: deals.slice(0, 20).map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: d.titulo,
          url: `https://www.cashlua.com.br/oferta/${d.slug}`,
        })),
      },
    },
  ];

  if (faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.pergunta,
        acceptedAnswer: { "@type": "Answer", text: f.resposta },
      })),
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title={title} description={description} path={path} jsonLd={jsonLd} />
      {!isLoading && deals.length === 0 && (
        <Helmet><meta name="robots" content="noindex, follow" /></Helmet>
      )}
      <Header search={search} onSearchChange={setSearch} />

      <main className="flex-1">
        <div className="container py-6 max-w-5xl space-y-5">
          <Breadcrumbs items={crumbs} />

          <header className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
              {h1}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {intro}
            </p>
            <p className="text-xs text-muted-foreground">
              {deals.length} {deals.length === 1 ? "oferta ativa" : "ofertas ativas"} nesta seção.
            </p>
          </header>

          {deals.length > 0 && <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_TOP} />}

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && deals.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">{emptyMessage}</p>
          )}

          <div className="space-y-3">
            {visibleDeals.map((deal, index) => (
              <div key={deal.id}>
                <DealCard deal={deal} />
                {(index + 1) % 8 === 0 && index < visibleDeals.length - 1 && (
                  <div className="mt-3">
                    <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_FEED} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {visibleDeals.length < deals.length && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="rounded-lg bg-primary px-5 py-3 font-heading text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-110"
              >
                Carregar mais ofertas
              </button>
            </div>
          )}

          {faq.length > 0 && (
            <section className="rounded-lg border border-border bg-card p-6">
              <h2 className="font-heading font-bold text-foreground mb-4">
                Perguntas frequentes
              </h2>
              <div className="space-y-4">
                {faq.map((f) => (
                  <div key={f.pergunta}>
                    <h3 className="text-sm font-heading font-bold text-foreground">
                      {f.pergunta}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {f.resposta}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {deals.length > 0 && (
            <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM} layout="rectangle" />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
