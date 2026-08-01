import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { PricePoint } from "@/hooks/useDealContent";

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const PriceHistoryChart = ({
  points,
  currentPrice,
}: {
  points: PricePoint[];
  currentPrice: number;
}) => {
  if (!points.length) return null;

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const first = prices[0];
  const last = prices[prices.length - 1];
  const range = max - min || 1;

  const trend = last > first ? "up" : last < first ? "down" : "flat";
  const isLowest = currentPrice > 0 && currentPrice <= min;

  return (
    <section className="mt-6 rounded-lg border border-border bg-card p-6">
      <h2 className="font-heading font-bold text-foreground mb-1">
        Histórico de preço
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Registramos o preço desta oferta a cada dia em que ela aparece no CashLua.
        {points.length < 3 && " Ainda temos poucos registros — o gráfico fica mais útil com o passar dos dias."}
      </p>

      <div className="flex items-end gap-1 h-24" role="img" aria-label="Gráfico do histórico de preços">
        {points.map((p, i) => {
          const height = 20 + ((p.price - min) / range) * 80;
          return (
            <div
              key={`${p.captured_at}-${i}`}
              className="flex-1 min-w-[3px] rounded-t bg-primary/70"
              style={{ height: `${height}%` }}
              title={`${new Date(p.captured_at).toLocaleDateString("pt-BR")}: ${brl(p.price)}`}
            />
          );
        })}
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground text-xs">Menor registrado</dt>
          <dd className="font-heading font-bold text-foreground">{brl(min)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Maior registrado</dt>
          <dd className="font-heading font-bold text-foreground">{brl(max)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-xs">Tendência</dt>
          <dd className="font-heading font-bold flex items-center gap-1">
            {trend === "down" && (
              <>
                <TrendingDown className="h-4 w-4 text-success" /> em queda
              </>
            )}
            {trend === "up" && (
              <>
                <TrendingUp className="h-4 w-4 text-destructive" /> em alta
              </>
            )}
            {trend === "flat" && (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" /> estável
              </>
            )}
          </dd>
        </div>
      </dl>

      {isLowest && points.length > 1 && (
        <p className="mt-3 text-sm font-medium text-success">
          Este é o menor preço que já registramos para esta oferta.
        </p>
      )}
    </section>
  );
};
