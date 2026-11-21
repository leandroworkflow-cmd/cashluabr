// Analytics próprio e anônimo do CashLua.
// - Conta uma visita por sessão (30 min sem atividade = nova sessão).
// - Mede tempo REAL: só soma segundos com a aba visível e o usuário ativo.
// - Sem IP, sem cookies de terceiros. O ID de visitante só persiste se o usuário aceitou cookies.

import { CONSENT_KEY } from "@/lib/adsense";

const ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track`;

const SESSION_KEY = "cl_session";
const VISITOR_KEY = "cl_visitor";
export const NO_TRACK_KEY = "cashlua_notrack";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min
const PING_EVERY = 10_000; // 10 s
const IDLE_AFTER = 2 * 60 * 1000; // 2 min sem interação = parado

type Session = { sid: string; last: number };

let memorySession: Session | null = null;
let currentSid: string | null = null;
let started = false;
let lastTick = 0;
let lastActivity = 0;

const randomId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "")
    : Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : memorySession;
  } catch {
    return memorySession;
  }
}

function writeSession(s: Session) {
  memorySession = s;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* sem storage: fica só em memória */
  }
}

function getSession(): string {
  const now = Date.now();
  const saved = readSession();
  const sid = saved && now - saved.last < SESSION_TIMEOUT ? saved.sid : randomId();
  writeSession({ sid, last: now });
  return sid;
}

function getVisitorId(sid: string): string {
  let consented = false;
  try {
    consented = localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    /* ignore */
  }
  if (!consented) return sid; // sem consentimento: cada sessão conta como um visitante
  try {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = randomId();
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  } catch {
    return sid;
  }
}

function shouldTrack(): boolean {
  if (typeof window === "undefined") return false;
  if (navigator.webdriver) return false;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) return false;
  if ((document as Document & { prerendering?: boolean }).prerendering) return false;
  try {
    if (localStorage.getItem(NO_TRACK_KEY) === "1") return false;
  } catch {
    /* ignore */
  }
  return true;
}

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      if (ok) return;
    }
  } catch {
    /* cai no fetch */
  }
  fetch(ENDPOINT, {
    method: "POST",
    body,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    keepalive: true,
    mode: "cors",
  }).catch(() => {});
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)bing\.com$/, "bing"],
  [/duckduckgo\.com$/, "duckduckgo"],
  [/(^|\.)yahoo\./, "yahoo"],
  [/instagram\.com$/, "instagram"],
  [/(^|\.)(facebook|fb)\.com$|^fb\.me$|^l\.facebook\.com$/, "facebook"],
  [/whatsapp\.com$|^wa\.me$/, "whatsapp"],
  [/(^|\.)t\.me$|telegram\.(org|me)$/, "telegram"],
  [/youtube\.com$|^youtu\.be$/, "youtube"],
  [/tiktok\.com$/, "tiktok"],
  [/(^|\.)(twitter|x)\.com$|^t\.co$/, "x"],
  [/pinterest\./, "pinterest"],
  [/reddit\.com$/, "reddit"],
  [/linkedin\.com$/, "linkedin"],
];

function classifySource(): string {
  try {
    const utm = new URLSearchParams(location.search).get("utm_source");
    if (utm) {
      const clean = utm.toLowerCase().replace(/[^a-z0-9._ -]/g, "").slice(0, 40);
      if (clean) return clean;
    }
    if (!document.referrer) return "direto";
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    if (host === location.hostname.replace(/^www\./, "")) return "direto";
    for (const [re, name] of SOURCES) if (re.test(host)) return name;
    return host.slice(0, 40);
  } catch {
    return "direto";
  }
}

function sendPageview(sid: string, path: string) {
  send({ t: "pv", sid, vid: getVisitorId(sid), path, src: classifySource() });
}

// Conta o tempo desde o último tick, se o usuário estava de fato presente.
function flush(ignoreHidden = false) {
  if (!started) return;
  const now = Date.now();
  const present = (ignoreHidden || !document.hidden) && now - lastActivity <= IDLE_AFTER;
  if (present) {
    const seconds = Math.min(30, Math.round((now - lastTick) / 1000));
    if (seconds > 0) {
      const sid = getSession();
      if (sid !== currentSid) {
        // sessão expirou e o usuário voltou: abre uma nova
        currentSid = sid;
        sendPageview(sid, location.pathname);
      }
      send({ t: "ping", sid, delta: seconds });
    }
  }
  lastTick = now;
}

function startHeartbeat() {
  if (started) return;
  started = true;
  lastTick = lastActivity = Date.now();

  const markActive = () => {
    lastActivity = Date.now();
  };
  (["pointerdown", "pointermove", "keydown", "scroll", "touchstart"] as const).forEach((ev) =>
    window.addEventListener(ev, markActive, { passive: true }),
  );

  setInterval(() => flush(), PING_EVERY);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      flush(true);
    } else {
      lastTick = lastActivity = Date.now();
    }
  });
  window.addEventListener("pagehide", () => flush(true));
}

export function trackPageview(pathname: string) {
  if (!shouldTrack() || pathname.startsWith("/admin")) return;
  const sid = getSession();
  currentSid = sid;
  sendPageview(sid, pathname);
  startHeartbeat();
}
