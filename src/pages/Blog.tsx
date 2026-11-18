import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, PenLine } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { ensureTodayPost, fetchBlogPosts, type BlogPost } from "@/lib/blog";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      const list = await fetchBlogPosts(30);
      if (!alive) return;

      if (list.length) {
        setPosts(list);
        setLoading(false);
        return;
      }

      // Primeiro acesso do dia: pede o artigo de hoje.
      setGenerating(true);
      const today = await ensureTodayPost();
      const again = await fetchBlogPosts(30);
      if (!alive) return;
      setPosts(again.length ? again : today ? [today] : []);
      setLoading(false);
      setGenerating(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <SEO
        title="Blog do CashLua | guias, análises e o resumo das ofertas do dia"
        description="Artigos escritos a partir das ofertas reais do CashLua: o que está com desconto de verdade, o que caiu de preço e como comprar melhor."
        path="/blog"
      />

      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs items={[{ name: "Blog" }]} />

        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Blog do CashLua</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Um artigo novo por dia, escrito a partir das ofertas que realmente estão
            na nossa base — com preço, desconto e data. Sem texto genérico de
            internet: se o produto não está no site, ele não entra no artigo.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            {generating
              ? "Escrevendo o artigo de hoje a partir das ofertas da base…"
              : "Carregando os artigos…"}
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-lg border border-border bg-secondary/40 p-5 text-sm">
            Ainda não há artigo publicado. Ele é gerado automaticamente quando alguém
            abre esta página — recarregue em alguns segundos.
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="rounded-lg border border-border bg-card p-5 hover:shadow-md transition-shadow"
              >
                {index === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    <PenLine className="h-3 w-3" /> Artigo mais recente
                  </span>
                )}
                <h2 className="mt-2 text-lg font-bold leading-snug">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt || post.meta_description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    {formatDate(post.published_on || post.published_at)}
                  </span>
                  {(post.tags ?? []).slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        <AdSlot className="my-8" />

        <div className="rounded-lg border border-border bg-secondary/40 p-5">
          <h2 className="text-base font-semibold">Continue lendo</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/tendencias" className="text-primary font-medium hover:underline">
              Tendências de hoje
            </Link>
            <Link to="/categorias" className="text-primary font-medium hover:underline">
              Categorias de oferta
            </Link>
            <Link to="/guias" className="text-primary font-medium hover:underline">
              Guias de compra
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
