import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ExternalLink, Loader2, Tag, MessageCircle, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { shortenUrl } from "@/lib/shorten";

interface ShopeeDeal {
  itemid: string;
  title: string;
  price: number | null;
  sale_price: number;
  discount: number;
  image: string | null;
  link: string;
  shop_name: string | null;
  category: string | null;
  rating: number | null;
}

const PER_PAGE = 24;

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const OfertasShopee = () => {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PER_PAGE);

  const { data, isLoading, error } = useQuery({
    queryKey: ["shopee-deals"],
    staleTime: 30 * 60 * 1000,
    queryFn: async (): Promise<ShopeeDeal[]> => {
      const { data, error } = await supabase
        .from("shopee_deals")
        .select("itemid, title, price, sale_price, discount, image, link, shop_name, category, rating")
        .order("discount", { ascending: false })
        .limit(800);
      if (error) throw error;
      return (data ?? []) as ShopeeDeal[];
    },
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const all = data ?? [];
    return term ? all.filter((d) => d.title.toLowerCase().includes(term)) : all;
  }, [data, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Ofertas Shopee com desconto | CashLua"
        description="Promoções da Shopee selecionadas automaticamente: produtos bem avaliados com desconto acima de 25%, atualizados direto do catálogo oficial de ofertas."
        path="/ofertas-shopee"
      />
      <Header search={search} onSearchChange={setSearch} />

      <main className="flex-1">
        <div className="container py-6 space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-primary" />
              Ofertas Shopee
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Produtos com desconto vindos do catálogo oficial de ofertas da Shopee. Os
              preços podem mudar a qualquer momento na loja.
            </p>
          </div>

          <NewsletterForm source="ofertas-shopee" />
          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_TOP} />

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Carregando ofertas da Shopee...</p>
            </div>
          )}

          {error && (
            <p className="text-center py-20 text-muted-foreground">
              Não foi possível carregar as ofertas agora. Tente novamente em instantes.
            </p>
          )}

          {!isLoading && !error && shown.length === 0 && (
            <p className="text-center py-20 text-muted-foreground">
              Nenhuma oferta encontrada.
            </p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {shown.map((d) => (
              <article
                key={d.itemid}
                className="group bg-card rounded-lg border border-border hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-secondary/30 flex items-center justify-center p-3 overflow-hidden relative">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={d.title}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem imagem</span>
                  )}
                  {d.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-hot text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="h-3 w-3" />-{d.discount}%
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1 gap-2">
                  <h2 className="text-sm font-heading font-semibold leading-snug line-clamp-3 text-card-foreground">
                    {d.title}
                  </h2>
                  <div className="mt-auto">
                    {d.price && d.price > d.sale_price && (
                      <span className="text-xs text-muted-foreground line-through block">
                        R$ {brl(d.price)}
                      </span>
                    )}
                    <span className="text-lg font-heading font-extrabold text-foreground">
                      R$ {brl(d.sale_price)}
                    </span>
                    {d.shop_name && (
                      <span className="block text-xs text-muted-foreground truncate">
                        {d.shop_name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href={d.link}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-heading font-bold text-xs px-3 py-2 rounded-lg hover:brightness-110 transition-all"
                    >
                      Ver na Shopee
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        const short = await shortenUrl(d.link, {
                          title: d.title,
                          image: d.image ?? "",
                          price: brl(d.sale_price),
                        });
                        const text = `🔥 Oferta na Shopee: ${d.title} por R$ ${brl(d.sale_price)}! 👉 ${short}`;
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(text)}`,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }}
                      className="inline-flex items-center justify-center gap-1.5 text-white font-heading font-bold text-xs px-3 py-2 rounded-lg hover:brightness-110 transition-all"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageCircle className="h-3 w-3" />
                      Compartilhar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visible < filtered.length && (
            <div className="flex justify-center py-4">
              <Button onClick={() => setVisible((v) => v + PER_PAGE)} variant="outline">
                Ver mais ofertas
              </Button>
            </div>
          )}

          <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_BOTTOM} layout="rectangle" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OfertasShopee;
