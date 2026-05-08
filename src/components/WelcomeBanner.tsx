import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const wasSeen = window.localStorage.getItem("welcome_seen");

    if (!wasSeen) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    window.localStorage.setItem("welcome_seen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className="border-b border-border bg-primary text-primary-foreground">
      <div className="container py-4">
        <div className="relative pr-10">
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute top-3 right-3 p-1 rounded-md hover:bg-black/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold mb-3 pr-8">
          Bem-vindo ao CashLua!
        </h2>
        <p className="text-sm sm:text-base leading-relaxed mb-6 opacity-90">
          O CashLua é um portal agregador de promoções. Nós não realizamos vendas
          diretas; nosso papel é selecionar e reunir as melhores ofertas dos
          maiores e-commerces do Brasil para você economizar em um só lugar.
        </p>
        <button
          onClick={dismiss}
          className="w-full rounded-lg bg-primary-foreground py-3 text-sm font-bold text-primary transition-opacity hover:opacity-90 sm:w-auto sm:px-5 sm:text-base"
        >
          Entendi, vamos às ofertas!
        </button>
      </div>
    </section>
  );
}
