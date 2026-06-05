import { Deal } from "./types";
import { Category } from "./types";

const SHEET_ID = "1x_45PJoQmKoFrCXeMAtvOXMlWrFYGB2tKcA6fFoS39s";
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
const MAX_IMPORTED_DEALS = 300;

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

export async function fetchDealsFromSheet(): Promise<Deal[]> {
  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();

    // Google Sheets returns JSONP-like response, strip wrapper
    const jsonString = text.substring(
      text.indexOf("{"),
      text.lastIndexOf("}") + 1
    );
    const data = JSON.parse(jsonString);

    const rows = data.table.rows.slice(0, MAX_IMPORTED_DEALS);
    const deals: Deal[] = rows.map((row: any, index: number) => {
      const cells = row.c;
      const titulo = cells[1]?.v || "Sem título";
      return {
        id: cells[0]?.v?.toString() || `deal-${index}`,
        titulo,
        preco: cells[2]?.v?.toString() || "0",
        link: cells[3]?.v || "#",
        imagem: cells[4]?.v || "",
        data: cells[5]?.v || new Date().toISOString(),
        loja: "Loja Online",
        categoria: inferCategory(titulo),
        temperatura: Math.floor(Math.random() * 500) + 50,
        comentarios: Math.floor(Math.random() * 30),
      };
    });

    return deals;
  } catch (error) {
    console.error("Erro ao buscar dados do Google Sheets:", error);
    return [];
  }
}
