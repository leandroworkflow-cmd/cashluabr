CREATE TABLE public.deal_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  deal_id text,
  seo_title text NOT NULL,
  meta_description text NOT NULL,
  body text NOT NULL,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.deal_content TO anon, authenticated;
GRANT ALL ON public.deal_content TO service_role;

ALTER TABLE public.deal_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read deal content"
ON public.deal_content FOR SELECT
USING (true);

CREATE TABLE public.price_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id text NOT NULL,
  slug text,
  price numeric NOT NULL,
  captured_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (deal_id, captured_at)
);

CREATE INDEX price_history_deal_id_idx ON public.price_history (deal_id, captured_at DESC);

GRANT SELECT ON public.price_history TO anon, authenticated;
GRANT ALL ON public.price_history TO service_role;

ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read price history"
ON public.price_history FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_deal_content_updated_at
BEFORE UPDATE ON public.deal_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();