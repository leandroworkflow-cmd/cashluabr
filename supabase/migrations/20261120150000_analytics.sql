-- Analytics próprio do CashLua: visitas reais + tempo no site.
-- Sem cookies de terceiros e sem IP. Só o service_role (edge functions) acessa.

CREATE TABLE public.analytics_sessions (
  sid            text PRIMARY KEY,
  vid            text NOT NULL,
  started_at     timestamptz NOT NULL DEFAULT now(),
  last_seen_at   timestamptz NOT NULL DEFAULT now(),
  active_seconds integer NOT NULL DEFAULT 0,
  pages          integer NOT NULL DEFAULT 1,
  landing_path   text NOT NULL,
  source         text NOT NULL DEFAULT 'direto',
  device         text NOT NULL DEFAULT 'desktop'
);

CREATE TABLE public.analytics_pageviews (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sid        text NOT NULL REFERENCES public.analytics_sessions(sid) ON DELETE CASCADE,
  path       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_sessions_started_idx  ON public.analytics_sessions (started_at DESC);
CREATE INDEX analytics_sessions_lastseen_idx ON public.analytics_sessions (last_seen_at DESC);
CREATE INDEX analytics_pageviews_created_idx ON public.analytics_pageviews (created_at DESC);
CREATE INDEX analytics_pageviews_sid_idx     ON public.analytics_pageviews (sid);

-- RLS ligado e SEM policies: anon/authenticated não leem nem escrevem nada.
ALTER TABLE public.analytics_sessions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_pageviews ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.analytics_sessions  FROM anon, authenticated;
REVOKE ALL ON public.analytics_pageviews FROM anon, authenticated;
GRANT ALL ON public.analytics_sessions  TO service_role;
GRANT ALL ON public.analytics_pageviews TO service_role;

-- Registra uma visualização de página (cria a sessão se ainda não existe).
CREATE OR REPLACE FUNCTION public.analytics_track(
  _sid text, _vid text, _path text, _source text, _device text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO analytics_sessions (sid, vid, landing_path, source, device)
  VALUES (_sid, _vid, _path, _source, _device)
  ON CONFLICT (sid) DO UPDATE
    SET pages = analytics_sessions.pages + 1,
        last_seen_at = now();

  INSERT INTO analytics_pageviews (sid, path) VALUES (_sid, _path);
END;
$$;

-- Soma segundos de atenção real (aba visível + usuário ativo).
CREATE OR REPLACE FUNCTION public.analytics_ping(_sid text, _delta integer)
RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE analytics_sessions
     SET last_seen_at = now(),
         active_seconds = active_seconds + least(greatest(_delta, 0), 30)
   WHERE sid = _sid;
$$;

-- Resumo para o painel. Dias contados no fuso de São Paulo (1 = hoje).
CREATE OR REPLACE FUNCTION public.analytics_summary(_days integer DEFAULT 7)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  tz        constant text := 'America/Sao_Paulo';
  n_days    integer := greatest(1, least(coalesce(_days, 7), 365));
  from_ts   timestamptz;
  result    jsonb;
BEGIN
  from_ts := (date_trunc('day', now() AT TIME ZONE tz) - ((n_days - 1) * interval '1 day')) AT TIME ZONE tz;

  SELECT jsonb_build_object(
    'days', n_days,

    'realtime', (
      SELECT count(*)::int FROM analytics_sessions
       WHERE last_seen_at > now() - interval '2 minutes'
    ),

    'totals', (
      SELECT jsonb_build_object(
        'sessions',       count(*)::int,
        'visitors',       count(DISTINCT vid)::int,
        'pageviews',      coalesce(sum(pages), 0)::int,
        'avg_seconds',    coalesce(round(avg(active_seconds)), 0)::int,
        'median_seconds', coalesce(round(percentile_cont(0.5) WITHIN GROUP (ORDER BY active_seconds)), 0)::int,
        'engaged',        count(*) FILTER (WHERE active_seconds >= 10 OR pages >= 2)::int
      )
      FROM analytics_sessions WHERE started_at >= from_ts
    ),

    'by_day', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
               'day', to_char(g.day, 'YYYY-MM-DD'),
               'sessions', coalesce(x.sessions, 0),
               'pageviews', coalesce(y.pv, 0)
             ) ORDER BY g.day), '[]'::jsonb)
      FROM (
        SELECT generate_series((from_ts AT TIME ZONE tz)::date, (now() AT TIME ZONE tz)::date, interval '1 day')::date AS day
      ) g
      LEFT JOIN (
        SELECT (started_at AT TIME ZONE tz)::date AS day, count(*)::int AS sessions
          FROM analytics_sessions WHERE started_at >= from_ts GROUP BY 1
      ) x ON x.day = g.day
      LEFT JOIN (
        SELECT (created_at AT TIME ZONE tz)::date AS day, count(*)::int AS pv
          FROM analytics_pageviews WHERE created_at >= from_ts GROUP BY 1
      ) y ON y.day = g.day
    ),

    'top_pages', (
      SELECT coalesce(jsonb_agg(r), '[]'::jsonb) FROM (
        SELECT path, count(*)::int AS views, count(DISTINCT sid)::int AS visitors
          FROM analytics_pageviews WHERE created_at >= from_ts
         GROUP BY path ORDER BY views DESC, path LIMIT 15
      ) r
    ),

    'sources', (
      SELECT coalesce(jsonb_agg(r), '[]'::jsonb) FROM (
        SELECT source, count(*)::int AS sessions
          FROM analytics_sessions WHERE started_at >= from_ts
         GROUP BY source ORDER BY sessions DESC, source LIMIT 10
      ) r
    ),

    'devices', (
      SELECT coalesce(jsonb_agg(r), '[]'::jsonb) FROM (
        SELECT device, count(*)::int AS sessions
          FROM analytics_sessions WHERE started_at >= from_ts
         GROUP BY device ORDER BY sessions DESC
      ) r
    ),

    'hours', (
      SELECT jsonb_agg(jsonb_build_object('hour', h.hour, 'sessions', coalesce(x.sessions, 0)) ORDER BY h.hour)
      FROM generate_series(0, 23) AS h(hour)
      LEFT JOIN (
        SELECT extract(hour FROM started_at AT TIME ZONE tz)::int AS hour, count(*)::int AS sessions
          FROM analytics_sessions WHERE started_at >= from_ts GROUP BY 1
      ) x ON x.hour = h.hour
    ),

    'durations', (
      SELECT jsonb_build_object(
        'lt10',   count(*) FILTER (WHERE active_seconds < 10),
        's10_30', count(*) FILTER (WHERE active_seconds >= 10  AND active_seconds < 30),
        's30_60', count(*) FILTER (WHERE active_seconds >= 30  AND active_seconds < 60),
        'm1_3',   count(*) FILTER (WHERE active_seconds >= 60  AND active_seconds < 180),
        'gt3',    count(*) FILTER (WHERE active_seconds >= 180)
      )
      FROM analytics_sessions WHERE started_at >= from_ts
    )
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.analytics_track(text, text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_ping(text, integer)               FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.analytics_summary(integer)                  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_track(text, text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.analytics_ping(text, integer)               TO service_role;
GRANT EXECUTE ON FUNCTION public.analytics_summary(integer)                  TO service_role;
