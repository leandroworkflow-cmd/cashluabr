import { ExternalLink, MessageCircle } from "lucide-react";
import { Deal } from "@/lib/types";
import { Link } from "react-router-dom";
import { shortenUrl } from "@/lib/shorten";

interface DealCardProps {
  deal: Deal;
}

// Considera "nova" uma oferta postada nas últimas 24h — critério real,
// calculado a partir da data informada na planilha (nada de número fabricado).
function isRecent(data: string): boolean {
  const posted = new Date(data).getTime();
  if (Number.isNaN(posted)) return false;
  return Date.now() - posted < 24 * 60 * 60 * 1000;
}

function formatDealDate(data: string): string {
  const value = new Date(data);
  if (Number.isNaN(value.getTime())) return "Data não informada";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(value);
}

export function DealCard({ deal }: DealCardProps) {
  return (
    <article className="group bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-200 animate-slide-up overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-40 h-40 sm:h-auto flex-shrink-0 bg-secondary/30 flex items-center justify-center p-3 overflow-hidden">
          {deal.imagem ? (
            <img
              src={deal.imagem}
              alt={deal.titulo}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
              Sem imagem
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {deal.loja || "Loja"}
              </span>
              <time className="text-xs text-muted-foreground" dateTime={deal.data}>
                {formatDealDate(deal.data)}
              </time>
            </div>

            <Link to={`/oferta/${deal.slug}`}>
              <h2 className="font-heading font-semibold text-card-foreground leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {deal.titulo}
              </h2>
            </Link>

            {isRecent(deal.data) && (
              <span className="inline-block mt-1 text-xs font-bold text-hot">
                ● Nova
              </span>
            )}
          </div>

          <div className="flex items-end justify-between mt-3 gap-3">
            <div>
                <span className="text-2xl font-heading font-extrabold text-foreground">
                  R$ {deal.preco}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  const short = await shortenUrl(deal.link, {
                    title: deal.titulo,
                    image: deal.imagem,
                    price: deal.preco,
                    pageUrl: `/oferta/${deal.slug || deal.id}`,
                  });
                  const text = `🔥 Olha essa oferta: ${deal.titulo} por R$ ${deal.preco}! 👉 ${short}`;
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="inline-flex items-center gap-1.5 text-white font-heading font-bold text-sm px-3 py-2 rounded-lg hover:brightness-110 transition-all shadow-sm"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
              <a
                href={deal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-heading font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all shadow-sm"
              >
                Pegar Oferta
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
