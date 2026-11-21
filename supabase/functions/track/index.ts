import { createClient } from 'npm:@supabase/supabase-js@2';

// Coleta anônima de visitas. Sem IP, sem cookies de terceiros.
// Chamada pelo site via sendBeacon/fetch (text/plain, sem preflight).

const ALLOWED_ORIGINS = [
  /^https?:\/\/(www\.)?cashlua\.com\.br$/,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
];

const BOT_RE =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python|java\/|go-http|okhttp|axios|node-fetch|scrapy|httpclient|libwww|phantomjs|puppeteer|playwright|selenium/i;

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const SRC_RE = /^[a-z0-9._ -]{1,40}$/;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
};

const done = () => new Response(null, { status: 204, headers: CORS });

function deviceFrom(ua: string): string {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android|windows phone/i.test(ua)) return 'celular';
  return 'desktop';
}

function cleanPath(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.startsWith('/')) return null;
  let p = raw.split('?')[0].split('#')[0].slice(0, 300);
  if (p.length > 1) p = p.replace(/\/+$/, '');
  if (p.startsWith('/admin')) return null;
  return p || '/';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return done();
  if (req.method !== 'POST') return done();

  try {
    const origin = req.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.some((re) => re.test(origin))) return done();

    const ua = req.headers.get('user-agent') || '';
    if (!ua || BOT_RE.test(ua)) return done();

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(await req.text());
    } catch {
      return done();
    }

    const sid = body.sid;
    if (typeof sid !== 'string' || !ID_RE.test(sid)) return done();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    if (body.t === 'pv') {
      const vid = body.vid;
      const path = cleanPath(body.path);
      if (typeof vid !== 'string' || !ID_RE.test(vid) || !path) return done();
      const src = typeof body.src === 'string' && SRC_RE.test(body.src) ? body.src : 'outros';

      const { error } = await supabase.rpc('analytics_track', {
        _sid: sid,
        _vid: vid,
        _path: path,
        _source: src,
        _device: deviceFrom(ua),
      });
      if (error) console.error('analytics_track', error.message);
    } else if (body.t === 'ping') {
      const delta = Math.round(Number(body.delta));
      if (!Number.isFinite(delta) || delta < 1) return done();
      const { error } = await supabase.rpc('analytics_ping', { _sid: sid, _delta: Math.min(delta, 30) });
      if (error) console.error('analytics_ping', error.message);
    }
  } catch (e) {
    console.error('track error', e);
  }
  return done();
});
