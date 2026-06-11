
CREATE TABLE public.short_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  url text NOT NULL,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_short_links_code ON public.short_links(code);
CREATE INDEX idx_short_links_url ON public.short_links(url);

GRANT SELECT, INSERT ON public.short_links TO anon, authenticated;
GRANT ALL ON public.short_links TO service_role;

ALTER TABLE public.short_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read short links"
  ON public.short_links FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create short links"
  ON public.short_links FOR INSERT
  WITH CHECK (true);

-- RPC para incrementar contador de cliques de forma atômica
CREATE OR REPLACE FUNCTION public.increment_short_link_click(_code text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.short_links SET clicks = clicks + 1 WHERE code = _code;
$$;

GRANT EXECUTE ON FUNCTION public.increment_short_link_click(text) TO anon, authenticated;
