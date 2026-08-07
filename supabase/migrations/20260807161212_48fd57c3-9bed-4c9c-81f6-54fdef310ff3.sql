CREATE TABLE public.shopee_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  itemid text NOT NULL UNIQUE,
  title text NOT NULL,
  price numeric,
  sale_price numeric NOT NULL,
  discount integer NOT NULL DEFAULT 0,
  image text,
  link text NOT NULL,
  shop_name text,
  category text,
  rating numeric,
  likes integer,
  synced_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shopee_deals TO anon;
GRANT SELECT ON public.shopee_deals TO authenticated;
GRANT ALL ON public.shopee_deals TO service_role;
ALTER TABLE public.shopee_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read shopee deals" ON public.shopee_deals FOR SELECT USING (true);
CREATE INDEX shopee_deals_discount_idx ON public.shopee_deals (discount DESC);
CREATE INDEX shopee_deals_synced_idx ON public.shopee_deals (synced_at DESC);