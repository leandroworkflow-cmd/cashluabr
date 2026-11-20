// Configuração única do Google AdSense.
// O ID do editor já está no ads.txt; os IDs dos blocos (slots) são criados no painel do AdSense
// e informados em variáveis de ambiente (veja .env.example). Sem slot, nenhum espaço é reservado.

export const ADSENSE_CLIENT =
  (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined) || "ca-pub-7054499486507421";

export const ADSENSE_SLOTS = {
  top: import.meta.env.VITE_ADSENSE_SLOT_TOP as string | undefined,
  feed: import.meta.env.VITE_ADSENSE_SLOT_FEED as string | undefined,
  bottom: import.meta.env.VITE_ADSENSE_SLOT_BOTTOM as string | undefined,
};

export const CONSENT_KEY = "cookie_consent";
export const CONSENT_EVENT = "cookie-consent-changed";

export function loadAdsenseScript() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[data-adsense-client="${ADSENSE_CLIENT}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  script.dataset.adsenseClient = ADSENSE_CLIENT;
  document.head.appendChild(script);
}
