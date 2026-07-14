import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ArrowLeft, Clock } from "lucide-react";
import { getGuiaBySlug, guiasContent } from "@/lib/guias-content";

const GuiaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const guia = getGuiaBySlug(slug);

  if (!guia) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header search="" onSearchChange={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-heading font-bold text-foreground">Guia não encontrado</h1>
            <Link to="/guias" className="text-primary hover:underline text-sm">
              Voltar para os guias
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const otherGuias = guiasContent.filter((g) => g.slug !== guia.slug).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${guia.title} - CashLua`}
        description={guia.excerpt}
        path={`/guias/${guia.slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guia.title,
          description: guia.excerpt,
        }}
      />
      <Header search="" onSearchChange={() => {}} />

      <main className="flex-1">
        <div className="container py-8 max-w-3xl mx-auto">
          <Link
            to="/guias"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar aos guias
          </Link>

          <article className="space-y-6">
            <header className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground leading-snug">
                {guia.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" /> Leitura de {guia.readingTime}
              </div>
            </header>

            <div className="prose prose-neutral max-w-none space-y-4 text-muted-foreground leading-relaxed">
              {guia.body.map((paragraph, i) =>
                paragraph.startsWith("## ") ? (
                  <h2
                    key={i}
                    className="text-lg font-heading font-bold text-foreground pt-2"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                ) : (
                  <p key={i}>{paragraph}</p>
                )
              )}
            </div>
          </article>

          {otherGuias.length > 0 && (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="font-heading font-bold text-foreground mb-4">Continue lendo</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {otherGuias.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/guias/${g.slug}`}
                    className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors"
                  >
                    <h3 className="text-sm font-heading font-bold text-foreground leading-snug">
                      {g.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuiaDetail;
