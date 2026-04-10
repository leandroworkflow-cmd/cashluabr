export function AdSlot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`adsense-slot w-full flex items-center justify-center bg-secondary/30 border border-dashed border-border rounded-lg min-h-[90px] sm:min-h-[120px] ${className}`}
    >
      <span className="text-xs text-muted-foreground">Espaço publicitário</span>
    </div>
  );
}
