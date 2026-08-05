import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

interface AdSlotProps {
  className?: string;
  slot?: string;
  format?: string;
  layout?: "horizontal" | "rectangle" | "vertical";
}

export function AdSlot({
  className = "",
  slot,
  format = "auto",
  layout = "horizontal",
}: AdSlotProps) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle injected by external script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // ignore
    }
  }, [slot]);

  const minH =
    layout === "rectangle"
      ? "min-h-[250px]"
      : layout === "vertical"
        ? "min-h-[600px]"
        : "min-h-[90px] sm:min-h-[120px]";

  // Não exibe espaços vazios ao público: placeholders reduzem a percepção de
  // qualidade e não devem ocupar mais espaço do que o conteúdo editorial.
  if (!ADSENSE_CLIENT || !slot) {
    return null;
  }

  return (
    <aside aria-label="Publicidade" className={`adsense-slot w-full ${minH} ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase text-muted-foreground">Publicidade</p>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
