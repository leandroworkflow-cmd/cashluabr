import { Link } from "react-router-dom";
import { guiasContent } from "@/lib/guias-content";

export function GuidesTeaser({ limit = 3 }: { limit?: number }) {
  const guias = guiasContent.slice(0, limit);
  if (guias.length === 0) return null;

  return (
    <section aria-labelledby="guias-home">
      <div className="flex items-end justify-between gap-4">
        <h2 id="guias-home" className="font-heading text-xl font-extrabold sm:text-2xl">
          Antes de comprar, leia
        </h2>
        <Link to="/guias" className="text-sm font-medium underline underline-offset-4 hover:text-accent">
          Ver todos os guias
        </Link>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
        {guias.map((g) => (
          <Link
            key={g.slug}
            to={`/guias/${g.slug}`}
            className="flex flex-col gap-2 bg-card p-5 transition-colors hover:bg-secondary/60"
          >
            <h3 className="font-heading text-base font-bold leading-snug">{g.title}</h3>
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{g.excerpt}</p>
            <span className="mt-auto pt-2 text-xs text-muted-foreground">Leitura de {g.readingTime}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
