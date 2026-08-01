import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/Breadcrumbs";
import {
  CATEGORY_HUBS,
  BRANDS,
  brandSlug,
  STORES,
  INTENT_HUBS,
} from "@/lib/seo-taxonomy";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <h2 className="font-heading font-bold text-foreground">{title}</h2>
    <div className="flex flex-wrap gap-2">{children}</div>
  </section>
);

const Chip = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:border-primary hover:text-primary transition-colors"
  >
    {children}
  </Link>
);

const Categorias = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Categorias de Ofertas — Promoções por Tema, Marca e Loja | CashLua"
        description="Navegue pelas promoções do CashLua por categoria, marca ou loja: celulares, notebooks, eletrodomésticos, games, moda, beleza, esportes e ferramentas."
        path="/categorias"
        jsonLd={breadcrumbJsonLd([{ name: "Categorias" }])}
      />
      <Header search={search} onSearchChange={setSearch} />

      <main className="flex-1">
        <div className="container py-6 max-w-4xl space-y-8">
          <Breadcrumbs items={[{ name: "Categorias" }]} />

          <header className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
              Todas as seções de ofertas
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
              Organizamos as promoções ativas do CashLua por tema, marca, loja e faixa
              de preço. Cada seção reúne as ofertas encontradas nas lojas parceiras e
              traz orientações sobre o que observar antes de comprar naquele tipo de
              produto.
            </p>
          </header>

          <Section title="Por categoria">
            {CATEGORY_HUBS.map((h) => (
              <Chip key={h.slug} to={`/categoria/${h.slug}`}>
                {h.name}
              </Chip>
            ))}
          </Section>

          <Section title="Por faixa de preço e destaque">
            {INTENT_HUBS.map((h) => (
              <Chip key={h.path} to={h.path}>
                {h.h1}
              </Chip>
            ))}
          </Section>

          <Section title="Por loja">
            {STORES.map((s) => (
              <Chip key={s.slug} to={`/loja/${s.slug}`}>
                {s.name}
              </Chip>
            ))}
          </Section>

          <Section title="Por marca">
            {BRANDS.map((b) => (
              <Chip key={b} to={`/marca/${brandSlug(b)}`}>
                {b}
              </Chip>
            ))}
          </Section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categorias;
