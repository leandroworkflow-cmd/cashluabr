import { Flame, MessageCircle, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Deal } from "@/lib/types";
import { Link } from "react-router-dom";

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const tempColor =
    (deal.temperatura || 0) > 300
      ? "text-hot"
      : (deal.temperatura || 0) > 100
      ? "text-primary"
      : "text-muted-foreground";

  return (
    <article className="group bg-card rounded-lg border border-border hover:shadow-lg transition-all duration-200 animate-slide-up overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Temperature sidebar */}
        <div className="hidden sm:flex flex-col items-center justify-center gap-1 px-3 py-4 bg-secondary/50 min-w-[60px]">
          <button className="p-1 rounded hover:bg-primary/10 transition-colors">
            <ThumbsUp className="h-4 w-4 text-muted-foreground hover:text-success" />
          </button>
          <div className={`flex items-center gap-0.5 font-heading font-bold text-sm ${tempColor}`}>
            <Flame className="h-3.5 w-3.5 animate-flame-pulse" />
            <span>{deal.temperatura || 0}°</span>
          </div>
          <button className="p-1 rounded hover:bg-destructive/10 transition-colors">
            <ThumbsDown className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>

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
              <span className="text-xs text-muted-foreground">{deal.data}</span>
            </div>

            <Link to={`/oferta/${deal.id}`}>
              <h2 className="font-heading font-semibold text-card-foreground leading-snug line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {deal.titulo}
              </h2>
            </Link>

            {/* Mobile temperature */}
            <div className={`sm:hidden flex items-center gap-1 mt-1 text-sm font-bold ${tempColor}`}>
              <Flame className="h-3.5 w-3.5 animate-flame-pulse" />
              <span>{deal.temperatura || 0}°</span>
            </div>
          </div>

          <div className="flex items-end justify-between mt-3 gap-3">
            <div>
              <span className="text-2xl font-heading font-extrabold text-foreground">
                R$ {deal.preco}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5" />
                {deal.comentarios || 0}
              </span>
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
