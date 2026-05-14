import { useEffect, useRef } from "react";
import { ExternalLink, ShoppingBag, Percent } from "lucide-react";

const AFFILIATE_LINK = "http://click.linksynergy.com/fs-bin/click?id=8H3SHComQW8&offerid=951620&type=3&subid=0";
const TRACKING_PIXEL = "http://ad.linksynergy.com/fs-bin/show?id=8H3SHComQW8&bids=951620&type=3&subid=0";

export function NetshoesBanner() {
  const pixelRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // O pixel de rastreamento ja carrega automaticamente via img src
  }, []);

  return (
    <a
      href={AFFILIATE_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      style={{ background: "linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%)" }}
    >
      {/* Pixel de rastreamento - invisivel e fora do fluxo */}
      <img
        ref={pixelRef}
        src={TRACKING_PIXEL}
        alt=""
        width={1}
        height={1}
        className="sr-only"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h3 className="text-white font-heading font-extrabold text-base sm:text-lg leading-tight">
              Netshoes
            </h3>
            <p className="text-white/90 text-xs sm:text-sm mt-0.5">
              As melhores ofertas em artigos esportivos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Percent className="w-3.5 h-3.5 text-white" />
            <span className="text-white text-xs font-bold">Afiliado</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white text-red-600 font-heading font-bold text-sm rounded-lg px-4 py-2 hover:bg-white/90 transition-colors">
            <span className="hidden sm:inline">Ver ofertas</span>
            <span className="sm:hidden">Ver</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </a>
  );
}
