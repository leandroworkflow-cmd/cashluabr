import { ExternalLink } from "lucide-react";

interface Store {
  name: string;
  url: string;
  bg: string;
  text: string;
  label: string;
  style?: string;
}

const STORES: Store[] = [
  {
    name: "Mercado Livre",
    url: "https://www.mercadolivre.com.br/ofertas",
    bg: "#FFE600",
    text: "#2D3277",
    label: "mercado livre",
  },
  {
    name: "Amazon",
    url: "https://www.amazon.com.br/deals",
    bg: "#131A22",
    text: "#FF9900",
    label: "amazon",
  },
  {
    name: "Shopee",
    url: "https://shopee.com.br/m/ofertas-do-dia",
    bg: "#EE4D2D",
    text: "#FFFFFF",
    label: "Shopee",
  },
  {
    name: "Netshoes",
    url: "http://click.linksynergy.com/fs-bin/click?id=8H3SHComQW8&offerid=951620&type=3&subid=0",
    bg: "#CC0000",
    text: "#FFFFFF",
    label: "netshoes",
    style: "italic",
  },
  {
    name: "Pague Menos",
    url: "https://www.paguemenos.com.br/ofertas",
    bg: "#0066B3",
    text: "#FFFFFF",
    label: "Pague Menos",
  },
];

export function PartnerStores() {
  return (
    <section aria-label="Lojas parceiras" className="space-y-3">
      <h2 className="text-sm font-heading font-bold text-foreground">
        Cupons das lojas parceiras:
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
        {STORES.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            title={`Ofertas ${s.name}`}
            className="group relative flex items-center justify-center h-14 sm:h-16 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all overflow-hidden"
            style={{ backgroundColor: s.bg }}
          >
            <span
              className="font-heading font-extrabold text-base sm:text-lg lowercase tracking-tight"
              style={{ color: s.text, fontStyle: s.style ?? "normal" }}
            >
              {s.label}
            </span>
            <ExternalLink
              className="absolute top-1.5 right-1.5 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ color: s.text }}
            />
          </a>
        ))}
      </div>
    </section>
  );
}
