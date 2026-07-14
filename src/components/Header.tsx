import { Search, User, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import moonLogo from "@/assets/moon-logo.png";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function Header({ search, onSearchChange }: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-14 gap-3">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src={moonLogo} alt="CashLua" className="w-8 h-8 object-contain rounded-lg" />
          <span className="font-heading font-extrabold text-lg text-foreground">
            CashLua
          </span>
        </Link>

        {/* Desktop search */}
        <div className="hidden sm:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar ofertas..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
          <a
            href="https://whatsapp.com/channel/0029VbCUmaZA2pLGCnyYDb2L"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Siga no WhatsApp"
          >
            <MessageCircle className="h-5 w-5 text-success" />
          </a>
          <Link
            to="/perfil"
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar ofertas..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}
    </header>
  );
}
