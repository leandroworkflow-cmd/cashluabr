import { Link } from "react-router-dom";

interface HomeIntroProps {
  total?: number;
}

const STORES = [
  { to: "/ofertas-do-dia", label: "Mercado Livre" },
  { to: "/ofertas-amazon", label: "Amazon" },
  { to: "/ofertas-shopee", label: "Shopee" },
];

export function HomeIntro({ total }: HomeIntroProps) {
  return (
    <section className="border-b border-border bg-card">
      <div className="container py-8 sm:py-12">
        <div className="max-w-3xl">
          <h1 className="font-heading text-3xl font-extrabold leading-[1.1] sm:text-5xl">
            Promoções e cupons para comprar pagando menos
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Reunimos ofertas de lojas como Amazon, Shopee, Mercado Livre e Netshoes. Compare o preço,
            abra a oferta na loja e confirme frete e prazo antes de finalizar.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href="#ofertas"
            className="rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-[filter] hover:brightness-95"
          >
            Ver ofertas de hoje
          </a>
          <nav aria-label="Ofertas por loja" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="text-muted-foreground">Por loja:</span>
            {STORES.map((s) => (
              <Link key={s.to} to={s.to} className="font-medium text-foreground underline underline-offset-4 hover:text-accent">
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          {typeof total === "number" && total > 0 && <>{total} ofertas listadas agora. </>}
          A CashLua não vende produtos: alguns links são de afiliados e podem gerar comissão sem custo
          para você.
        </p>
      </div>
    </section>
  );
}
