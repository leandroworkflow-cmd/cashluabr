import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-lg p-1.5">
              <Flame className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-foreground">CashLua</span>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/sobre" className="hover:text-foreground transition-colors">
              Quem Somos
            </Link>
            <Link to="/contato" className="hover:text-foreground transition-colors">
              Contato
            </Link>
            <Link to="/termos" className="hover:text-foreground transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-foreground transition-colors">
              Política de Privacidade
            </Link>
          </nav>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} CashLua. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
