import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

async function deriveSecret(apiKey: string): Promise<string> {
  const data = new TextEncoder().encode(`telegram-webhook:${apiKey}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function safeEqual(a: string | null, b: string): boolean {
  if (!a || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function slugify(titulo: string, id: string | number): string {
  const normalized = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${normalized}-${id}`.slice(0, 120);
}

// Formato padrão esperado (uma informação por linha):
//   Título do produto
//   R$ 199,90
//   https://link.da.oferta
function parseDeal(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const urlRegex = /(https?:\/\/[^\s]+)/i;
  const priceRegex = /R\$\s*[\d.,]+/i;

  let link = "";
  let preco = "";
  const titleParts: string[] = [];

  for (const line of lines) {
    const urlMatch = line.match(urlRegex);
    if (urlMatch && !link) {
      link = urlMatch[1];
      const rest = line.replace(urlMatch[1], "").trim();
      if (rest && !priceRegex.test(rest)) titleParts.push(rest);
      continue;
    }
    const priceMatch = line.match(priceRegex);
    if (priceMatch && !preco) {
      preco = priceMatch[0].replace(/^R\$\s*/i, "").trim();
      const rest = line.replace(priceMatch[0], "").replace(/por|apenas|:|-/gi, "").trim();
      if (rest) titleParts.push(rest);
      continue;
    }
    titleParts.push(line);
  }

  const titulo = titleParts.join(" ").replace(/\s+/g, " ").trim();
  return { titulo, preco, link };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!TELEGRAM_API_KEY || !LOVABLE_API_KEY || !SUPABASE_URL || !SERVICE_KEY) {
    return new Response(JSON.stringify({ error: "Missing configuration" }), { status: 500 });
  }

  const expected = await deriveSecret(TELEGRAM_API_KEY);
  if (!safeEqual(req.headers.get("X-Telegram-Bot-Api-Secret-Token"), expected)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const update = await req.json();
  const message =
    update.channel_post ?? update.message ?? update.edited_channel_post ?? update.edited_message;

  const text: string = message?.text ?? message?.caption ?? "";
  if (!message?.chat?.id || !text) {
    return new Response(JSON.stringify({ ok: true, ignored: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { titulo, preco, link } = parseDeal(text);
  if (!titulo || !link) {
    return new Response(JSON.stringify({ ok: true, ignored: "sem titulo ou link" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Imagem: pega a maior foto da mensagem e serve via proxy público
  let imagem = "";
  const photos = message.photo as Array<{ file_id: string }> | undefined;
  if (photos?.length) {
    try {
      const fileRes = await fetch(`${GATEWAY_URL}/getFile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_id: photos[photos.length - 1].file_id }),
      });
      const fileJson = await fileRes.json();
      const filePath = fileJson?.result?.file_path;
      if (filePath) {
        imagem = `${SUPABASE_URL}/functions/v1/tg-image?path=${encodeURIComponent(filePath)}`;
      }
    } catch (e) {
      console.error("Falha ao obter imagem do Telegram:", e);
    }
  }

  const messageId = message.message_id as number;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { error } = await supabase.from("telegram_deals").upsert(
    {
      message_id: messageId,
      chat_id: message.chat.id,
      slug: slugify(titulo, messageId),
      titulo,
      preco: preco || null,
      link,
      imagem: imagem || null,
      loja: "Loja Online",
      raw_text: text,
      posted_at: new Date((message.date ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    },
    { onConflict: "message_id" },
  );

  if (error) {
    console.error("Erro ao salvar oferta:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
