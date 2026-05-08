import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "";

    if (!localStorage.getItem("welcome_seen")) {
      setVisible(true);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem("welcome_seen", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] px-4 sm:bottom-6">
      <div
        className="relative mx-auto w-full max-w-md rounded-xl bg-primary p-5 shadow-2xl text-primary-foreground sm:p-6"
        role="status"
      >
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
          className="w-full py-3 rounded-lg bg-primary-foreground text-primary font-heading font-bold text-sm sm:text-base hover:opacity-90 transition-opacity"
        >
          Entendi, vamos às ofertas!
        </button>
      </div>
    </div>
  );
}
