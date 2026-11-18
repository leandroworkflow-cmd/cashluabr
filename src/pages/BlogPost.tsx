import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/Breadcrumbs";
import { SEO } from "@/components/SEO";
import { ensureTodayPost, fetchBlogPost, type BlogPost } from "@/lib/blog";

const SITE_URL = "https://www.cashlua.com.br";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Texto do artigo: parágrafos e subtítulos marcados com "## ". */
function renderBody(body: string) {
  return body
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="mt-8 mb-3 text-xl font-bold">
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }
      return (
        <p key={i} className="mb-4 text-[15px] leading-7 text-foreground/90">
          {block}
        </p>
      );
    });
}

export default function BlogPost() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function load() {
      const found = await fetchBlogPost(slug);
      if (alive) {
        setPost(found);
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-sm text-muted-foreground">Carregando o artigo…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10">
        <SEO
          title="Artigo não encontrado | CashLua"
          description="Este artigo do blog do CashLua não está disponível."
          path={`/blog/${slug}`}
          noindex
        />
        <h1 className="text-2xl font-bold">Artigo não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Esse endereço ainda não tem artigo publicado.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link to="/blog" className="text-primary font-medium hover:underline">
            Ver os artigos publicados
          </Link>
          <Link to="/tendencias" className="text-primary font-medium hover:underline">
            Tendências de hoje
          </Link>
        </div>
      </div>
    );
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description,
    datePublished: post.published_at,
    dateModified: post.published_at,
    inLanguage: "pt-BR",
    author: { "@type": "Organization", name: "CashLua", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "CashLua",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <SEO
        title={`${post.title} | CashLua`}
        description={post.meta_description}
        path={`/blog/${post.slug}`}
        type="article"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Blog", path: "/blog" },
              { name: post.title },
            ]),
          ),
        }}
      />

      <article className="container mx-auto max-w-3xl px-4 py-6">
        <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: post.title }]} />

        <header>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(post.published_on || post.published_at)}
            </span>
            {(post.tags ?? []).slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-6">{renderBody(post.body)}</div>

        {(post.deal_refs ?? []).length > 0 && (
          <aside className="mt-10 rounded-lg border border-border bg-secondary/40 p-5">
            <h2 className="text-base font-semibold">Ofertas citadas neste artigo</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {post.deal_refs.map((ref) => (
                <li key={ref.title} className="flex items-center justify-between gap-3">
                  <span className="text-foreground/90">{ref.title}</span>
                  <span className="font-semibold whitespace-nowrap">{ref.preco}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Os preços acima foram lidos da base no dia da publicação e podem mudar.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <Link to="/ofertas-shopee" className="text-primary font-medium hover:underline">
                Ver as ofertas da Shopee
              </Link>
              <Link to="/tendencias" className="text-primary font-medium hover:underline">
                Tendências de hoje
              </Link>
            </div>
          </aside>
        )}

        <AdSlot className="my-8" />

        <div className="rounded-lg border border-border p-5">
          <h2 className="text-base font-semibold">Ler mais</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link to="/blog" className="text-primary font-medium hover:underline">
              Todos os artigos
            </Link>
            <Link to="/categorias" className="text-primary font-medium hover:underline">
              Categorias de oferta
            </Link>
            <Link to="/guias" className="text-primary font-medium hover:underline">
              Guias de compra
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
