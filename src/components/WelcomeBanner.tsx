import { useState, useEffect } from "react";

export function WelcomeBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("welcome_seen")) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      localStorage.setItem("welcome_seen", "true");
      setVisible(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        className={`w-full max-w-md rounded-xl bg-primary p-6 sm:p-8 shadow-2xl text-primary-foreground transition-all duration-300 ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      >
        <h2 className="text-xl sm:text-2xl font-heading font-extrabold mb-3">
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
