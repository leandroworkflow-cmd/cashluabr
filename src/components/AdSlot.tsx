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

  // No client/slot configured → render dashed placeholder
  if (!ADSENSE_CLIENT || !slot) {
    return (
      <div
        className={`adsense-slot w-full flex items-center justify-center bg-secondary/30 border border-dashed border-border rounded-lg ${minH} ${className}`}
      >
        <span className="text-xs text-muted-foreground">Espaço publicitário</span>
      </div>
    );
  }

  return (
    <div className={`adsense-slot w-full ${minH} ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
