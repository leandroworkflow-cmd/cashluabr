import { Link } from "react-router-dom";
import moonLogo from "@/assets/moon-logo.png";

const EXPLORE = [
  { to: "/ofertas-do-dia", label: "Ofertas do Mercado Livre" },
  { to: "/ofertas-amazon", label: "Ofertas da Amazon" },
  { to: "/ofertas-shopee", label: "Ofertas da Shopee" },
  { to: "/categorias", label: "Categorias" },
  { to: "/guias", label: "Guias e dicas" },
];

const INSTITUTIONAL = [
  { to: "/sobre", label: "Quem somos" },
  { to: "/contato", label: "Contato" },
  { to: "/termos", label: "Termos de uso" },
  { to: "/privacidade", label: "Política de privacidade" },
];

export function Footer() {
  const linkClass = "text-sm text-ink-foreground/75 transition-colors hover:text-primary";

  return (
    <footer className="mt-16 bg-ink text-ink-foreground">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <img src={moonLogo} alt="" className="h-9 w-9 rounded-md object-cover" width={36} height={36} />
              <span className="font-heading text-xl font-extrabold tracking-tight">CashLua</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-foreground/75">
              Reunimos promoções e cupons de lojas brasileiras e publicamos guias para você comprar
              com mais segurança.
            </p>
          </div>

          <nav aria-label="Explorar">
            <h2 className="font-heading text-sm font-bold text-ink-foreground">Explorar</h2>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Institucional">
            <h2 className="font-heading text-sm font-bold text-ink-foreground">Institucional</h2>
            <ul className="mt-4 space-y-2.5">
              {INSTITUTIONAL.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-ink-soft pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-ink-foreground/65">
            A CashLua não vende produtos. Alguns links são de afiliados e podem gerar comissão sem
            custo adicional para você. Preços, estoque e condições mudam a qualquer momento: confirme
            tudo no site da loja antes de comprar.
          </p>
          <p className="mt-3 text-xs text-ink-foreground/65">
            © {new Date().getFullYear()} CashLua. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
