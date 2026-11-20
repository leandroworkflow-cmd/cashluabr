import { useEffect, useState, FormEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, MessageCircle, Search, User, X } from "lucide-react";
import moonLogo from "@/assets/moon-logo.png";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const NAV = [
  { to: "/ofertas-do-dia", label: "Mercado Livre" },
  { to: "/ofertas-amazon", label: "Amazon" },
  { to: "/ofertas-shopee", label: "Shopee" },
  { to: "/categorias", label: "Categorias" },
  { to: "/guias", label: "Guias" },
];

const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbCUmaZA2pLGCnyYDb2L";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-ink-soft text-primary" : "text-ink-foreground/80 hover:text-ink-foreground"
  }`;

export function Header({ search, onSearchChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fecha o menu ao trocar de página
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Em páginas sem lista própria, a busca leva para a home com o termo
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(search.trim() ? `/?q=${encodeURIComponent(search.trim())}` : "/");
    }
  };

  const searchField = (id: string) => (
    <form onSubmit={submit} role="search" className="relative w-full">
      <label htmlFor={id} className="sr-only">
        Buscar ofertas
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-foreground/60" />
      <input
        id={id}
        type="search"
        placeholder="Buscar produto ou loja"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-md border border-transparent bg-ink-soft py-2 pl-9 pr-3 text-sm text-ink-foreground placeholder:text-ink-foreground/55 focus:border-primary focus:outline-none"
      />
    </form>
  );

  return (
    <header className="sticky top-0 z-50 bg-ink text-ink-foreground">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2.5" aria-label="CashLua, página inicial">
          <img src={moonLogo} alt="" className="h-9 w-9 rounded-md object-cover" width={36} height={36} />
          <span className="font-heading text-xl font-extrabold tracking-tight">CashLua</span>
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block">{searchField("busca-desktop")}</div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Canal no WhatsApp
          </a>
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="hidden rounded-md p-2 text-ink-foreground/80 transition-colors hover:text-ink-foreground lg:block"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="rounded-md p-2 text-ink-foreground lg:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="menu-mobile" className="border-t border-ink-soft lg:hidden">
          <div className="container space-y-3 py-4">
            <div className="md:hidden">{searchField("busca-mobile")}</div>
            <nav aria-label="Principal (celular)" className="grid grid-cols-2 gap-1">
              {NAV.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
              <NavLink to="/perfil" className={navClass}>
                Meu perfil
              </NavLink>
            </nav>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground sm:hidden"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Entrar no canal do WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
