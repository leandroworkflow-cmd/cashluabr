import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Clock, Eye, LogOut, MousePointerClick, RefreshCw, Users } from "lucide-react";
import { NO_TRACK_KEY } from "@/lib/analytics";

type Summary = {
  days: number;
  realtime: number;
  totals: {
    sessions: number;
    visitors: number;
    pageviews: number;
    avg_seconds: number;
    median_seconds: number;
    engaged: number;
  };
  by_day: { day: string; sessions: number; pageviews: number }[];
  top_pages: { path: string; views: number; visitors: number }[];
  sources: { source: string; sessions: number }[];
  devices: { device: string; sessions: number }[];
  hours: { hour: number; sessions: number }[];
  durations: { lt10: number; s10_30: number; s30_60: number; m1_3: number; gt3: number };
};

const KEY_STORAGE = "cl_admin_key";
const PERIODS = [
  { days: 1, label: "Hoje" },
  { days: 7, label: "7 dias" },
  { days: 30, label: "30 dias" },
  { days: 90, label: "90 dias" },
];

const num = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");

function duration(s: number) {
  if (!s) return "0s";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m}min ${r}s` : `${m}min`;
}

const getKey = () => {
  try {
    return sessionStorage.getItem(KEY_STORAGE) || "";
  } catch {
    return "";
  }
};

async function fetchSummary(days: number, key: string): Promise<Summary> {
  const base = import.meta.env.VITE_SUPABASE_URL;
  const res = await fetch(`${base}/functions/v1/analytics-stats?days=${days}`, {
    headers: {
      "x-admin-key": key,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    },
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Falha ao carregar os dados.");
  }
  return res.json();
}

const Kpi = ({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Eye;
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className="rounded-lg border border-border bg-card p-4">
    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <Icon className="h-4 w-4" aria-hidden /> {label}
    </div>
    <div className="mt-2 font-heading text-2xl font-bold text-foreground">{value}</div>
    {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
  </div>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-border bg-card p-4">
    <h2 className="mb-3 font-heading text-sm font-bold text-foreground">{title}</h2>
    {children}
  </section>
);

const Bars = ({ rows }: { rows: { label: string; value: number }[] }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((a, r) => a + r.value, 0);
  if (!total) return <p className="text-sm text-muted-foreground">Sem dados no período.</p>;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="flex justify-between gap-2">
            <span className="truncate text-foreground">{r.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {num(r.value)} · {pct(r.value, total)}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded bg-secondary">
            <div className="h-1.5 rounded bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
};

const AdminAnalytics = () => {
  const [key, setKey] = useState(getKey);
  const [input, setInput] = useState("");
  const [days, setDays] = useState(7);
  const [ignoreMe, setIgnoreMe] = useState(() => {
    try {
      return localStorage.getItem(NO_TRACK_KEY) === "1";
    } catch {
      return false;
    }
  });

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["analytics-summary", days, key],
    queryFn: () => fetchSummary(days, key),
    enabled: !!key,
    refetchInterval: 30_000,
    retry: false,
  });

  const logout = () => {
    try {
      sessionStorage.removeItem(KEY_STORAGE);
    } catch {
      /* ignore */
    }
    setKey("");
    setInput("");
  };

  const toggleIgnoreMe = () => {
    const next = !ignoreMe;
    try {
      if (next) localStorage.setItem(NO_TRACK_KEY, "1");
      else localStorage.removeItem(NO_TRACK_KEY);
    } catch {
      /* ignore */
    }
    setIgnoreMe(next);
  };

  const unauthorized = error instanceof Error && error.message === "UNAUTHORIZED";

  const head = (
    <Helmet>
      <title>Painel de visitas | CashLua</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );

  if (!key || unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        {head}
        <form
          className="w-full max-w-sm rounded-lg border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const k = input.trim();
            if (!k) return;
            try {
              sessionStorage.setItem(KEY_STORAGE, k);
            } catch {
              /* ignore */
            }
            setKey(k);
          }}
        >
          <h1 className="font-heading text-lg font-bold text-foreground">Painel de visitas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Digite a chave de administrador.</p>
          {unauthorized && <p className="mt-3 text-sm font-medium text-destructive">Chave inválida.</p>}
          <input
            type="password"
            autoComplete="current-password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-4 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Chave"
          />
          <button
            type="submit"
            className="mt-3 w-full rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const t = data?.totals;
  const durRows = data
    ? [
        { label: "Menos de 10 s", value: data.durations.lt10 },
        { label: "10 a 30 s", value: data.durations.s10_30 },
        { label: "30 a 60 s", value: data.durations.s30_60 },
        { label: "1 a 3 min", value: data.durations.m1_3 },
        { label: "Mais de 3 min", value: data.durations.gt3 },
      ]
    : [];

  const dayLabel = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;

  return (
    <div className="min-h-screen bg-background">
      {head}
      <div className="container max-w-6xl space-y-4 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="mr-auto font-heading text-xl font-bold text-foreground">Painel de visitas</h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${data && data.realtime > 0 ? "animate-pulse bg-success" : "bg-muted-foreground"}`}
            />
            <strong className="tabular-nums">{data ? data.realtime : "–"}</strong> agora no site
          </span>
          <div className="flex rounded-md border border-border bg-card p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setDays(p.days)}
                className={`rounded px-3 py-1 text-sm font-medium ${
                  days === p.days ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
            aria-label="Atualizar"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-border bg-card p-2 text-muted-foreground hover:text-foreground"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {error && !unauthorized && (
          <p className="rounded-md border border-destructive/40 bg-card p-3 text-sm text-destructive">
            {(error as Error).message}
          </p>
        )}

        {!data && !error && <p className="text-sm text-muted-foreground">Carregando…</p>}

        {data && t && (
          <>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
              <Kpi icon={MousePointerClick} label="Visitas" value={num(t.sessions)} hint="sessões reais, sem robôs" />
              <Kpi icon={Users} label="Visitantes únicos" value={num(t.visitors)} hint="aproximado" />
              <Kpi
                icon={Eye}
                label="Páginas vistas"
                value={num(t.pageviews)}
                hint={t.sessions ? `${(t.pageviews / t.sessions).toFixed(1)} por visita` : undefined}
              />
              <Kpi icon={Clock} label="Tempo médio" value={duration(t.avg_seconds)} hint="tempo ativo por visita" />
              <Kpi icon={Clock} label="Tempo mediano" value={duration(t.median_seconds)} hint="metade ficou mais que isso" />
              <Kpi
                icon={Activity}
                label="Taxa de rejeição"
                value={t.sessions ? pct(t.sessions - t.engaged, t.sessions) : "—"}
                hint="saiu em <10 s, 1 página"
              />
            </div>

            <Panel title="Visitas por dia">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.by_day} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tickFormatter={dayLabel} tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={dayLabel}
                      formatter={(v: number, n: string) => [num(v), n === "sessions" ? "Visitas" : "Páginas vistas"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      stroke="hsl(var(--ink))"
                      fill="hsl(var(--ink))"
                      fillOpacity={0.08}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="hsl(var(--primary))"
                      fillOpacity={0.25}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Âmbar: visitas · Cinza: páginas vistas. Dias no horário de Brasília.
              </p>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Quanto tempo ficaram no site">
                <Bars rows={durRows} />
              </Panel>
              <Panel title="Horário das visitas (Brasília)">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.hours} margin={{ left: -24, right: 4 }}>
                      <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} tickFormatter={(h) => `${h}h`} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip labelFormatter={(h) => `${h}h`} formatter={(v: number) => [num(v), "Visitas"]} />
                      <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="De onde vêm">
                <Bars rows={data.sources.map((s) => ({ label: s.source, value: s.sessions }))} />
              </Panel>
              <Panel title="Aparelhos">
                <Bars rows={data.devices.map((d) => ({ label: d.device, value: d.sessions }))} />
              </Panel>
            </div>

            <Panel title="Páginas mais vistas">
              {data.top_pages.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-muted-foreground">
                        <th className="pb-2 font-medium">Página</th>
                        <th className="pb-2 text-right font-medium">Views</th>
                        <th className="pb-2 text-right font-medium">Visitas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.top_pages.map((p) => (
                        <tr key={p.path} className="border-t border-border">
                          <td className="max-w-[420px] truncate py-2 text-foreground">{p.path}</td>
                          <td className="py-2 text-right tabular-nums">{num(p.views)}</td>
                          <td className="py-2 text-right tabular-nums">{num(p.visitors)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sem dados no período.</p>
              )}
            </Panel>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              <p>
                “Visita” = uma sessão (30 min sem atividade abre outra). Robôs e acessos de teste ficam de fora. Tempo =
                só quando a aba está aberta e a pessoa está ativa.
              </p>
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={ignoreMe} onChange={toggleIgnoreMe} />
                Não contar minhas visitas neste aparelho
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
