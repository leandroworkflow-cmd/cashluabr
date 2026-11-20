import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CONSENT_EVENT, CONSENT_KEY, loadAdsenseScript } from "@/lib/adsense";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") loadAdsenseScript();
    if (!consent) setVisible(true);
  }, []);

  const choose = (value: "accepted" | "declined") => {
    localStorage.setItem(CONSENT_KEY, value);
    if (value === "accepted") loadAdsenseScript();
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]"
    >
      <div className="container flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          Usamos cookies necessários para o site e, com a sua autorização, cookies de publicidade do
          Google para medir e personalizar anúncios. Você pode recusar sem perder acesso às ofertas.
          Saiba mais na{" "}
          <Link to="/privacidade" className="font-medium text-foreground underline underline-offset-2">
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="min-w-[110px] rounded-md border border-foreground px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="min-w-[110px] rounded-md border border-foreground bg-foreground px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
