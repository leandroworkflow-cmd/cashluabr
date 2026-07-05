-- Guarda o caminho da página do produto no próprio site do CashLua
-- (ex: /oferta/nome-do-produto-abc123), para que o link curto compartilhado
-- no WhatsApp abra a página da oferta no cashlua.com.br em vez de ir direto
-- para a loja. O botão "Ir para a loja" dentro dessa página é quem leva
-- o cliente até o link de afiliado.
ALTER TABLE public.short_links
  ADD COLUMN IF NOT EXISTS page_url text;
