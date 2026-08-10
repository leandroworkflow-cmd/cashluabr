CREATE TABLE public.telegram_deals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id bigint NOT NULL UNIQUE,
  chat_id bigint,
  slug text NOT NULL,
  titulo text NOT NULL,
  preco text,
  link text NOT NULL,
  imagem text,
  loja text,
  categoria text,
  raw_text text,
  posted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.telegram_deals TO anon;
GRANT SELECT ON public.telegram_deals TO authenticated;
GRANT ALL ON public.telegram_deals TO service_role;

ALTER TABLE public.telegram_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read telegram deals"
ON public.telegram_deals FOR SELECT
USING (true);

CREATE TRIGGER update_telegram_deals_updated_at
BEFORE UPDATE ON public.telegram_deals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_telegram_deals_posted_at ON public.telegram_deals (posted_at DESC);
CREATE INDEX idx_telegram_deals_slug ON public.telegram_deals (slug);