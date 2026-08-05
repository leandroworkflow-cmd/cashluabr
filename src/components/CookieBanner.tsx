import { useState, useEffect } from "react";

const ADSENSE_CLIENT = "ca-pub-7054499486507421";

function enableAdsense() {
  if (document.querySelector(`script[data-adsense-client="${ADSENSE_CLIENT}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.dataset.adsenseClient = ADSENSE_CLIENT;
  document.head.appendChild(script);
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") enableAdsense();
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    enableAdsense();
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: "accepted" }));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: "declined" }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-slide-up">
      <div className="container flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm text-muted-foreground flex-1">
          Usamos cookies necessários para o site e, com sua autorização, cookies de publicidade do Google para medir e personalizar anúncios. Você pode aceitar ou recusar sem perder acesso às ofertas. Consulte nossa{" "}
          <a href="/privacidade" className="underline text-foreground">
            Política de Privacidade
          </a>{" "}
          conforme a LGPD.
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-border transition-colors"
          >
            Recusar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
