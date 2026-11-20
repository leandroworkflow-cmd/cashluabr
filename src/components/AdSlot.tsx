import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT, CONSENT_EVENT, CONSENT_KEY } from "@/lib/adsense";

interface AdSlotProps {
  className?: string;
  slot?: string;
  format?: string;
  layout?: "horizontal" | "rectangle" | "vertical";
}

/**
 * Bloco de anúncio do Google AdSense.
 * - Só aparece com ID de bloco configurado e consentimento de cookies (LGPD).
 * - Sempre identificado como "Publicidade" e separado do conteúdo.
 * - Reserva altura mínima para não deslocar o layout (CLS).
 * - Se o Google não preencher o bloco, o CSS global recolhe o espaço.
 */
export function AdSlot({
  className = "",
  slot,
  format = "auto",
  layout = "horizontal",
}: AdSlotProps) {
  const pushed = useRef(false);
  const [hasConsent, setHasConsent] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(CONSENT_KEY) === "accepted"
  );

  useEffect(() => {
    const updateConsent = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      setHasConsent(detail === "accepted");
    };
    window.addEventListener(CONSENT_EVENT, updateConsent);
    return () => window.removeEventListener(CONSENT_EVENT, updateConsent);
  }, []);

  useEffect(() => {
    if (!slot || !hasConsent || pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle é injetado pelo script externo
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ignora: o script pode ainda não ter carregado
    }
  }, [slot, hasConsent]);

  if (!slot || !hasConsent) return null;

  const minH =
    layout === "rectangle"
      ? "min-h-[280px]"
      : layout === "vertical"
        ? "min-h-[600px]"
        : "min-h-[110px]";

  return (
    <aside
      aria-label="Publicidade"
      className={`adsense-slot w-full overflow-hidden border-y border-border/70 py-2 ${className}`}
    >
      <p className="mb-1 text-center text-[11px] text-muted-foreground">Publicidade</p>
      <div className={minH}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
}
