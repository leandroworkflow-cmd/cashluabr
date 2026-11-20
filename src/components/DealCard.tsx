import { ExternalLink, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Deal } from "@/lib/types";
import { shortenUrl } from "@/lib/shorten";
import { formatBRL } from "@/lib/format";

interface DealCardProps {
  deal: Deal;
}

// "Nova" = publicada nas últimas 24h, calculado a partir da data real da oferta.
function isRecent(data: string): boolean {
  const posted = new Date(data).getTime();
  if (Number.isNaN(posted)) return false;
  return Date.now() - posted < 24 * 60 * 60 * 1000;
}

function formatDealDate(data: string): string {
  const value = new Date(data);
  if (Number.isNaN(value.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(value);
}

export function DealCard({ deal }: DealCardProps) {
  const detailPath = `/oferta/${deal.slug || deal.id}`;
  const date = formatDealDate(deal.data);
  const price = formatBRL(deal.preco);

  const share = async () => {
    const short = await shortenUrl(deal.link, {
      title: deal.titulo,
      image: deal.imagem,
      price: deal.preco,
      pageUrl: detailPath,
    });
    const text = `Olha essa oferta: ${deal.titulo} por ${price}. ${short}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-md">
      <Link to={detailPath} className="relative block aspect-square bg-white p-4" tabIndex={-1} aria-hidden="true">
        {deal.imagem ? (
          <img
            src={deal.imagem}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
            Sem imagem
          </div>
        )}
        {isRecent(deal.data) && (
          <span className="absolute left-2 top-2 rounded-sm bg-hot px-1.5 py-0.5 text-[11px] font-bold text-hot-foreground">
            Nova
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 border-t border-border p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate font-medium">{deal.loja || "Loja parceira"}</span>
          {date && (
            <time dateTime={deal.data} className="flex-shrink-0">
              {date}
            </time>
          )}
        </div>

        <h2 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-card-foreground sm:text-[15px]">
          <Link to={detailPath} className="hover:underline">
            {deal.titulo}
          </Link>
        </h2>

        <p className="mt-auto pt-1 font-heading text-2xl font-extrabold tabular-nums text-foreground">
          {price}
        </p>

        <div className="flex gap-2">
          <a
            href={deal.link}
            target="_blank"
            rel="noopener noreferrer sponsored nofollow"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2.5 text-sm font-bold text-primary-foreground transition-[filter] hover:brightness-95"
          >
            Ver oferta
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={share}
            aria-label={`Compartilhar no WhatsApp: ${deal.titulo}`}
            className="inline-flex items-center justify-center rounded-md border border-border px-3 text-success transition-colors hover:bg-secondary"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
