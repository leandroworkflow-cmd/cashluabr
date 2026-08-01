import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

interface FaqItem {
  pergunta: string;
  resposta: string;
}

interface DealContent {
  seo_title: string;
  meta_description: string;
  body: string;
  faq: FaqItem[];
}

function bad(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function parsePrice(value: string): number {
  const cleaned = String(value ?? '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(,|$))/g, '')
    .replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return bad('Corpo inválido');

    const slug = typeof body.slug === 'string' ? body.slug.trim().slice(0, 160) : '';
    const titulo = typeof body.titulo === 'string' ? body.titulo.trim().slice(0, 300) : '';
    const preco = typeof body.preco === 'string' ? body.preco.slice(0, 40) : '';
    const categoria = typeof body.categoria === 'string' ? body.categoria.slice(0, 60) : '';
    const loja = typeof body.loja === 'string' ? body.loja.slice(0, 60) : '';
    const dealId = typeof body.dealId === 'string' ? body.dealId.slice(0, 80) : null;

    if (!slug || !titulo) return bad('slug e titulo são obrigatórios');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Registra o preço do dia (histórico) — ignora duplicidade no mesmo dia.
    const numericPrice = parsePrice(preco);
    if (dealId && numericPrice > 0) {
      await supabase
        .from('price_history')
        .upsert(
          { deal_id: dealId, slug, price: numericPrice },
          { onConflict: 'deal_id,captured_at', ignoreDuplicates: true },
        );
    }

    // Cache: conteúdo já gerado antes
    const { data: cached } = await supabase
      .from('deal_content')
      .select('seo_title, meta_description, body, faq')
      .eq('slug', slug)
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ ...cached, cached: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return bad('LOVABLE_API_KEY não configurada', 500);

    const prompt = `Escreva conteúdo editorial original em português do Brasil para a página de uma oferta de um site agregador de promoções chamado CashLua.

Produto: ${titulo}
Preço promocional: R$ ${preco}
Categoria: ${categoria || 'Geral'}
Loja: ${loja || 'Loja parceira'}

Regras:
- O texto principal ("body") deve ter entre 300 e 500 palavras, dividido em 3 a 5 parágrafos, em texto puro (sem markdown, sem títulos).
- Fale de para quem o produto é indicado, principais características prováveis pela descrição, o que observar antes de comprar e como avaliar se o preço está bom.
- Nunca invente especificações técnicas exatas, notas de avaliação, número de vendas nem percentuais de desconto reais. Fale de forma útil e honesta.
- Nunca prometa que o preço vai continuar o mesmo.
- "seo_title": até 60 caracteres, com o nome do produto e apelo de promoção.
- "meta_description": até 155 caracteres, atraente e descritiva.
- "faq": 4 perguntas frequentes reais que um comprador faria sobre este produto/compra, com respostas de 2 a 4 frases.`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': apiKey,
      },
      body: JSON.stringify({
        model: 'google/gemini-3.6-flash',
        messages: [
          { role: 'system', content: 'Você é um redator SEO especialista em e-commerce brasileiro. Responda somente com JSON válido.' },
          { role: 'user', content: prompt },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'deal_content',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                seo_title: { type: 'string' },
                meta_description: { type: 'string' },
                body: { type: 'string' },
                faq: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      pergunta: { type: 'string' },
                      resposta: { type: 'string' },
                    },
                    required: ['pergunta', 'resposta'],
                  },
                },
              },
              required: ['seo_title', 'meta_description', 'body', 'faq'],
            },
          },
        },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error(`AI gateway failed [${aiRes.status}]: ${errText}`);
      return new Response(
        JSON.stringify({ error: 'Falha ao gerar conteúdo', status: aiRes.status, details: errText }),
        { status: aiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const aiJson = await aiRes.json();
    const raw = aiJson?.choices?.[0]?.message?.content ?? '';
    let content: DealContent;
    try {
      content = JSON.parse(raw);
    } catch {
      console.error('Resposta da IA não é JSON:', raw.slice(0, 500));
      return bad('Resposta da IA inválida', 502);
    }

    const record = {
      slug,
      deal_id: dealId,
      seo_title: String(content.seo_title || titulo).slice(0, 120),
      meta_description: String(content.meta_description || '').slice(0, 300),
      body: String(content.body || ''),
      faq: Array.isArray(content.faq) ? content.faq.slice(0, 6) : [],
    };

    const { error: insertError } = await supabase
      .from('deal_content')
      .upsert(record, { onConflict: 'slug' });

    if (insertError) console.error('Erro ao salvar deal_content', insertError);

    return new Response(JSON.stringify({ ...record, cached: false }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('deal-content error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
