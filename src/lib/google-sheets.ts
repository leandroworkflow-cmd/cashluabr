import { Deal } from "./types";
import { Category } from "./types";

const SHEET_ID = "1x_45PJoQmKoFrCXeMAtvOXMlWrFYGB2tKcA6fFoS39s";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;
const MAX_IMPORTED_DEALS = 300;
const SHEET_QUERY = "select A,B,C,D,E,F where B is not null";

const CATEGORY_KEYWORDS: { category: Exclude<Category, "Todos">; keywords: string[] }[] = [
  {
    category: "Eletrônicos",
    keywords: [
      "celular", "smartphone", "iphone", "samsung", "xiaomi", "motorola", "capinha", "capa", "película",
      "pelicula", "fone", "headphone", "headset", "bluetooth", "carregador", "cabo", "usb", "tv ", "smart tv",
      "notebook", "laptop", "tablet", "monitor", "teclado", "mouse", "webcam", "caixa de som", "alexa",
      "echo", "roteador", "ssd", "hd ", "pendrive", "câmera", "camera", "drone", "relógio inteligente",
      "smartwatch", "eletrônico", "eletronico",
    ],
  },
  {
    category: "Games",
    keywords: [
      "ps5", "ps4", "playstation", "xbox", "nintendo", "switch", "controle", "joystick", "game ", "gamer",
      "jogo ", "console", "headset gamer", "cadeira gamer",
    ],
  },
  {
    category: "Moda",
    keywords: [
      "camiseta", "camisa", "blusa", "vestido", "calça", "calca", "short", "bermuda", "saia", "jaqueta",
      "casaco", "moletom", "tênis", "tenis", "sapato", "sandália", "sandalia", "sapatilha", "chinelo",
      "bota", "bolsa", "mochila", "carteira", "cinto", "óculos", "oculos", "boné", "bone", "relógio",
      "relogio", "biquíni", "biquini", "lingerie", "pijama", "meia", "meias", "roupa",
    ],
  },
  {
    category: "Beleza",
    keywords: [
      "maquiagem", "batom", "base ", "rímel", "rimel", "sombra", "delineador", "perfume", "creme", "hidratante",
      "shampoo", "condicionador", "máscara capilar", "mascara capilar", "cabelo", "cachos", "modelador",
      "secador", "chapinha", "esmalte", "unha", "unhas", "skincare", "protetor solar", "sérum", "serum",
      "depilador", "barba", "barbear",
    ],
  },
  {
    category: "Esportes",
    keywords: [
      "academia", "musculação", "musculacao", "halter", "anilha", "kettlebell", "yoga", "pilates", "corrida",
      "ciclismo", "bicicleta", "bike", "patins", "skate", "futebol", "chuteira", "bola ", "natação",
      "natacao", "fitness", "esporte", "esportivo", "camping", "trilha",
    ],
  },
  {
    category: "Casa",
    keywords: [
      "panela", "frigideira", "talher", "prato", "copo", "xícara", "xicara", "jarra", "garrafa", "marmita",
      "cozinha", "geladeira", "fogão", "fogao", "micro-ondas", "microondas", "liquidificador", "batedeira",
      "air fryer", "airfryer", "fritadeira", "aspirador", "vassoura", "rodo", "balde", "organizador",
      "cabide", "cortina", "tapete", "almofada", "cobertor", "edredom", "lençol", "lencol", "travesseiro",
      "decoração", "decoracao", "luminária", "luminaria", "lâmpada", "lampada", "ferramenta", "parafusadeira",
      "furadeira", "estilete", "casa ",
    ],
  },
  {
    category: "Livros",
    keywords: [
      "livro", "caderno", "agenda", "caneta", "lápis", "lapis", "borracha", "estojo", "mochila escolar",
      "papelaria", "marcador", "fichário", "fichario",
    ],
  },
  {
    category: "Alimentos",
    keywords: [
      "chocolate", "café", "cafe", "achocolatado", "leite", "biscoito", "bolacha", "doce", "bala",
      "chiclete", "salgadinho", "snack", "tempero", "azeite", "óleo", "oleo", "açúcar", "acucar",
      "farinha", "macarrão", "macarrao", "molho", "suplemento", "whey", "proteína", "proteina",
      "vitamina", "comida", "alimento", "culinário", "culinario", "cmc", "celulose",
    ],
  },
];

function generateSlug(titulo: string, id: string): string {
  const normalized = titulo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${normalized}-${id}`.slice(0, 120);
}

function inferCategory(titulo: string): Exclude<Category, "Todos"> {
  const t = titulo.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => t.includes(kw))) return category;
  }
  return "Eletrônicos";
}

function parseSheetDate(value: unknown, fallback: Date): string {
  if (!value) return fallback.toISOString();
  if (typeof value === "string" && value.startsWith("Date(")) {
    const inner = value.slice(5, -1);
    const [year, month, day] = inner.split(",").map((s) => parseInt(s.trim(), 10));
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const d = new Date(year, month, day);
      if (Number.isFinite(d.getTime())) return d.toISOString();
    }
  }
  const d = new Date(value as string);
  return Number.isFinite(d.getTime()) ? d.toISOString() : fallback.toISOString();
}

export async function fetchDealsFromSheet(): Promise<Deal[]> {
  try {
    const params = new URLSearchParams({
      tqx: "out:json",
      tq: SHEET_QUERY,
      _: Math.floor(Date.now() / 300000).toString(),
    });
    const response = await fetch(`${SHEET_URL}?${params.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Planilha respondeu com status ${response.status}`);
    }
    const text = await response.text();

    // Google Sheets returns JSONP-like response, strip wrapper
    const jsonString = text.substring(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1
    );
    if (!jsonString) throw new Error("Resposta da planilha sem dados JSON");
    const data = JSON.parse(jsonString);
    if (data.status !== "ok" || !data.table?.rows) {
      throw new Error(data.errors?.[0]?.detailed_message || "Resposta inválida da planilha");
    }

    // Linhas novas são adicionadas no FIM da planilha: lemos as últimas
    // MAX_IMPORTED_DEALS e invertemos para que as mais recentes venham primeiro.
    const allRows: any[] = data.table.rows.filter(
      (r: any) => r?.c && (r.c[1]?.v || r.c[3]?.v)
    );
    const rows = allRows.slice(-MAX_IMPORTED_DEALS).reverse();
    const now = Date.now();
    const deals: Deal[] = rows.map((row: any, index: number) => {
      const cells = row.c;
      const titulo = cells[1]?.v || "Sem título";
      const id = cells[0]?.v?.toString() || `deal-${index}`;
      return {
        id,
        slug: generateSlug(titulo, id),
        titulo,
        preco: cells[2]?.v?.toString().replace(/^R\$\s*/i, "").trim() || "0",
        link: cells[3]?.v || "#",
        imagem: cells[4]?.v || "",
        // Data vazia não descarta a oferta: usa a ordem da planilha como
        // proxy de recência (mais recente = mais perto do fim do arquivo).
        data: parseSheetDate(cells[5]?.v, new Date(now - index * 60000)),
        loja: "Loja Online",
        categoria: inferCategory(titulo),
        // Sem métrica real de popularidade vinda da planilha.
        // Não inventamos números de "temperatura"/comentários aqui —
        // isso seria conteúdo enganoso para o usuário (e para revisão do AdSense).
        temperatura: 0,
        comentarios: 0,
      };
    });

    console.info(`[CashLua] Ofertas carregadas: ${deals.length} de ${allRows.length} linhas válidas`);
    return deals;
  } catch (error) {
    console.error("Erro ao buscar dados do Google Sheets:", error);
    throw error instanceof Error ? error : new Error("Não foi possível carregar as ofertas");
  }
}
