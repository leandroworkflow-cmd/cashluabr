ALTER TABLE public.short_links
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS price text;

DROP POLICY IF EXISTS "Anyone can update short link meta" ON public.short_links;
CREATE POLICY "Anyone can update short link meta"
ON public.short_links
FOR UPDATE
USING (true)
WITH CHECK (true);