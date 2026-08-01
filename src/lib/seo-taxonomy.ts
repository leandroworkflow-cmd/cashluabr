import { Deal } from "./types";

export interface Hub {
  slug: string;
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  faq: { pergunta: string; resposta: string }[];
  match: (deal: Deal) => boolean;
}

const norm = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function parsePrecoNumber(preco: string | undefined): number {
  if (!preco) return 0;
  const cleaned = preco
    .toString()
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(,|$))/g, "")
    .replace(",", ".");
  const value = parseFloat(cleaned);
  return Number.isFinite(value) ? value : 0;
}

const byKeywords = (keywords: string[]) => (deal: Deal) => {
  const t = norm(deal.titulo);
  return keywords.some((k) => t.includes(norm(k)));
};

/* ---------------------------------- Categorias --------------------------------- */

export const CATEGORY_HUBS: Hub[] = [
  {
    slug: "celulares",
    name: "Celulares",
    h1: "Celulares em promoção",
    title: "Celulares em Promoção — Ofertas de Smartphones | CashLua",
    description:
      "Ofertas de celulares e smartphones atualizadas diariamente: Samsung, Xiaomi, Motorola e mais, com preço e link direto para a loja.",
    intro:
      "Celular é a categoria com maior variação de preço no e-commerce brasileiro: o mesmo modelo pode oscilar centenas de reais em poucas semanas, principalmente perto de datas como Black Friday e lançamentos de novas linhas. Aqui reunimos as ofertas de smartphones que estão ativas agora, com o preço atual e o link direto para a loja. Antes de comprar, confira a versão de memória (um mesmo modelo costuma ter variações de 128 GB e 256 GB com preços bem diferentes) e se o aparelho é da versão nacional ou importada, o que muda a garantia.",
    faq: [
      {
        pergunta: "Qual é a melhor época para comprar celular?",
        resposta:
          "Historicamente, os melhores preços aparecem na Black Friday, em datas promocionais das próprias lojas e logo depois do lançamento de uma nova geração, quando o modelo anterior cai de preço.",
      },
      {
        pergunta: "Vale a pena comprar celular importado?",
        resposta:
          "Pode sair mais barato, mas a garantia costuma não ser feita no Brasil e existe risco de tributação na entrada. Se garantia e assistência importam para você, prefira a versão nacional.",
      },
      {
        pergunta: "Como saber se o desconto do celular é real?",
        resposta:
          "Compare o preço atual com o de outras lojas e observe o histórico. Descontos anunciados sobre um 'preço de tabela' inflado são comuns nessa categoria.",
      },
    ],
    match: byKeywords([
      "celular",
      "smartphone",
      "iphone",
      "galaxy",
      "redmi",
      "poco",
      "moto g",
      "motorola",
    ]),
  },
  {
    slug: "notebooks",
    name: "Notebooks",
    h1: "Notebooks em promoção",
    title: "Notebooks em Promoção — Ofertas de Laptops | CashLua",
    description:
      "Promoções de notebooks para trabalho, estudo e jogos. Preços atualizados e link direto para a loja parceira.",
    intro:
      "Notebook é uma compra de médio a longo prazo, então o preço sozinho não conta toda a história. O que mais pesa no uso do dia a dia é a combinação de processador, memória RAM e tipo de armazenamento: um modelo com SSD e 8 GB de RAM tende a ser mais confortável do que um com processador melhor e disco mecânico. Nesta página listamos as ofertas de notebooks ativas no momento, com o valor atual em cada loja.",
    faq: [
      {
        pergunta: "Quanta memória RAM é suficiente?",
        resposta:
          "Para navegação, estudo e trabalho em escritório, 8 GB dá conta. Para edição de imagem, muitas abas simultâneas ou jogos, 16 GB traz uma diferença perceptível.",
      },
      {
        pergunta: "SSD ou HD?",
        resposta:
          "SSD, sempre que possível. Ele é o componente que mais muda a sensação de velocidade no dia a dia, mesmo em máquinas mais simples.",
      },
      {
        pergunta: "Notebook em promoção costuma ser modelo antigo?",
        resposta:
          "Muitas vezes sim, e isso não é necessariamente ruim. Um modelo da geração anterior com boa configuração costuma ter melhor custo-benefício do que um lançamento de entrada.",
      },
    ],
    match: byKeywords(["notebook", "laptop", "macbook", "chromebook", "ultrabook"]),
  },
  {
    slug: "fones-de-ouvido",
    name: "Fones de ouvido",
    h1: "Fones de ouvido em promoção",
    title: "Fones de Ouvido em Promoção — Bluetooth e Com Fio | CashLua",
    description:
      "Ofertas de fones de ouvido bluetooth, headsets e earbuds com preço atualizado e link direto para a loja.",
    intro:
      "Fones bluetooth ficaram baratos, mas a variação de qualidade entre modelos de preço parecido é enorme. Os pontos que realmente mudam a experiência são autonomia de bateria, estabilidade da conexão e se o modelo tem cancelamento de ruído ativo de verdade (e não apenas isolamento passivo). Abaixo estão as ofertas de fones que localizamos agora.",
    faq: [
      {
        pergunta: "Cancelamento de ruído ativo vale a pena?",
        resposta:
          "Faz diferença em transporte público e ambientes com ruído constante. Em ambientes silenciosos, o ganho é pequeno e talvez não justifique o preço maior.",
      },
      {
        pergunta: "Quanto tempo dura a bateria de um fone bluetooth?",
        resposta:
          "Modelos atuais entregam entre 4 e 8 horas por carga, mais recargas no estojo. A autonomia real cai com volume alto e cancelamento de ruído ligado.",
      },
    ],
    match: byKeywords(["fone", "headphone", "headset", "earbud", "airpod"]),
  },
  {
    slug: "eletrodomesticos",
    name: "Eletrodomésticos",
    h1: "Eletrodomésticos em promoção",
    title: "Eletrodomésticos em Promoção — Air Fryer, Cozinha e Casa | CashLua",
    description:
      "Ofertas de air fryer, liquidificador, aspirador e outros eletrodomésticos para a casa, com preços atualizados.",
    intro:
      "Eletroportáteis são o tipo de produto em que a promoção realmente compensa, porque a diferença de preço entre lojas costuma ser grande e o produto tem uso diário. Vale prestar atenção na potência, na capacidade útil (que quase sempre é menor do que a capacidade anunciada) e na disponibilidade de assistência técnica da marca no Brasil.",
    faq: [
      {
        pergunta: "Air fryer de qual capacidade escolher?",
        resposta:
          "Até 4 litros atende uma ou duas pessoas. Para famílias de três ou mais, modelos de 5 litros ou mais evitam ter que preparar em duas etapas.",
      },
      {
        pergunta: "Marca desconhecida em promoção compensa?",
        resposta:
          "Só se houver assistência técnica no Brasil e política clara de troca. Em eletroportáteis, o custo de um reparo pode superar a economia do desconto.",
      },
    ],
    match: byKeywords([
      "air fryer",
      "airfryer",
      "fritadeira",
      "liquidificador",
      "batedeira",
      "aspirador",
      "cafeteira",
      "micro-ondas",
      "microondas",
      "geladeira",
      "fogao",
      "fogão",
    ]),
  },
  {
    slug: "games",
    name: "Games",
    h1: "Games e consoles em promoção",
    title: "Games em Promoção — Consoles, Jogos e Acessórios | CashLua",
    description:
      "Promoções de consoles, jogos, controles e acessórios gamer com preço atualizado e link direto para a loja.",
    intro:
      "Na categoria de games, o desconto mais interessante quase nunca está no console em si, e sim nos jogos, controles e acessórios. Jogos físicos caem de preço rápido depois do lançamento, e periféricos como controles extras e headsets têm promoções frequentes. Aqui estão as ofertas de games ativas neste momento.",
    faq: [
      {
        pergunta: "Jogo físico ou digital: qual sai mais barato?",
        resposta:
          "O físico costuma cair mais de preço no varejo e pode ser revendido; o digital compensa em grandes promoções das lojas oficiais.",
      },
      {
        pergunta: "Vale esperar promoção para comprar console?",
        resposta:
          "Consoles raramente têm descontos agressivos fora de datas como Black Friday, mas bundles com jogos incluídos aparecem com frequência e representam economia real.",
      },
    ],
    match: byKeywords([
      "ps5",
      "ps4",
      "playstation",
      "xbox",
      "nintendo",
      "switch",
      "controle",
      "gamer",
      "console",
    ]),
  },
  {
    slug: "moda-masculina",
    name: "Moda masculina",
    h1: "Moda masculina em promoção",
    title: "Moda Masculina em Promoção — Roupas e Calçados | CashLua",
    description:
      "Ofertas de camisetas, calças, tênis e acessórios masculinos com preço atualizado e link direto para a loja.",
    intro:
      "Roupa em promoção online tem um risco específico: a tabela de medidas. Grades variam bastante entre marcas nacionais e importadas, e trocar depois consome o tempo e às vezes o frete. Antes de finalizar, meça uma peça que já serve bem e compare com a tabela da loja. Abaixo estão as ofertas de moda masculina que encontramos.",
    faq: [
      {
        pergunta: "Como acertar o tamanho comprando online?",
        resposta:
          "Meça uma peça sua que serve bem (largura do peito, comprimento) e compare com a tabela de medidas em centímetros da loja, em vez de confiar apenas no P/M/G.",
      },
      {
        pergunta: "Tênis em promoção costuma ser de numeração sobrando?",
        resposta:
          "Com frequência sim. Por isso as maiores quedas de preço aparecem em numerações nas pontas da grade.",
      },
    ],
    match: (deal) =>
      byKeywords([
        "masculin",
        "camiseta",
        "camisa",
        "bermuda",
        "cueca",
        "tenis masculino",
      ])(deal) && !norm(deal.titulo).includes("feminin"),
  },
  {
    slug: "moda-feminina",
    name: "Moda feminina",
    h1: "Moda feminina em promoção",
    title: "Moda Feminina em Promoção — Roupas e Calçados | CashLua",
    description:
      "Ofertas de vestidos, blusas, calças e calçados femininos com preço atualizado e link direto para a loja.",
    intro:
      "Moda feminina é a categoria com maior giro de promoções: coleções trocam rápido e o estoque remanescente entra em liquidação em poucos meses. Isso significa preços bons, mas também grades incompletas. Vale conferir a composição do tecido e a tabela de medidas antes de comprar. Veja as ofertas ativas abaixo.",
    faq: [
      {
        pergunta: "Vale a pena comprar peça de coleção passada?",
        resposta:
          "Sim, quando a peça é básica e atemporal. O desconto costuma ser bem maior e a qualidade é a mesma do lançamento.",
      },
      {
        pergunta: "Como reduzir o risco de errar o tamanho?",
        resposta:
          "Confira a tabela em centímetros, leia comentários sobre modelagem e prefira lojas com política de troca gratuita.",
      },
    ],
    match: byKeywords([
      "feminin",
      "vestido",
      "blusa",
      "saia",
      "legging",
      "biquini",
      "biquíni",
      "lingerie",
    ]),
  },
  {
    slug: "beleza",
    name: "Beleza",
    h1: "Beleza e cuidados pessoais em promoção",
    title: "Beleza em Promoção — Perfumes, Skincare e Maquiagem | CashLua",
    description:
      "Ofertas de perfumes, skincare, maquiagem e cuidados com o cabelo, com preço atualizado e link para a loja.",
    intro:
      "Em beleza, o preço por mililitro costuma ser mais revelador do que o preço final: embalagens maiores em promoção quase sempre rendem melhor. Também vale checar a validade informada pela loja, já que produtos com data mais próxima aparecem com frequência entre as maiores quedas de preço.",
    faq: [
      {
        pergunta: "Perfume em promoção é original?",
        resposta:
          "Compre sempre de lojas conhecidas ou vendedores oficiais dentro dos marketplaces. Preços muito abaixo da média são o principal sinal de alerta.",
      },
      {
        pergunta: "Como comparar preços de cosméticos?",
        resposta:
          "Divida o preço pelo volume (ml ou g). Um produto aparentemente mais caro pode custar menos por unidade de uso.",
      },
    ],
    match: byKeywords([
      "perfume",
      "maquiagem",
      "batom",
      "shampoo",
      "condicionador",
      "hidratante",
      "skincare",
      "protetor solar",
      "esmalte",
      "secador",
    ]),
  },
  {
    slug: "esportes",
    name: "Esportes",
    h1: "Esportes e fitness em promoção",
    title: "Esportes em Promoção — Fitness, Corrida e Academia | CashLua",
    description:
      "Ofertas de artigos esportivos, equipamentos de academia e roupas de treino com preço atualizado.",
    intro:
      "Equipamentos de treino em casa têm promoções fortes fora do início do ano, quando a procura cai. Para calçados esportivos, o ponto mais importante é o tipo de uso: um tênis de corrida e um de treino funcional têm construções diferentes, e usar o errado desgasta mais rápido.",
    faq: [
      {
        pergunta: "Tênis de corrida serve para academia?",
        resposta:
          "Serve, mas não é o ideal. Corrida pede amortecimento; treino funcional pede estabilidade lateral, que o tênis de corrida não oferece.",
      },
      {
        pergunta: "Quando os equipamentos de academia ficam mais baratos?",
        resposta:
          "Costumam cair no meio do ano e em datas promocionais, quando a demanda de janeiro já passou.",
      },
    ],
    match: byKeywords([
      "academia",
      "musculacao",
      "musculação",
      "halter",
      "corrida",
      "bicicleta",
      "chuteira",
      "fitness",
      "esportiv",
      "yoga",
    ]),
  },
  {
    slug: "ferramentas",
    name: "Ferramentas",
    h1: "Ferramentas em promoção",
    title: "Ferramentas em Promoção — Furadeira, Parafusadeira e Kits | CashLua",
    description:
      "Ofertas de ferramentas manuais e elétricas para casa e oficina, com preço atualizado e link direto para a loja.",
    intro:
      "Ferramenta é um dos poucos itens em que pagar um pouco mais costuma se pagar: motor, bateria e acabamento definem quanto tempo o produto dura sob uso frequente. Para uso doméstico esporádico, porém, kits de entrada em promoção resolvem bem. Confira as ofertas ativas.",
    faq: [
      {
        pergunta: "Parafusadeira a bateria ou com fio?",
        resposta:
          "A bateria ganha em praticidade para uso doméstico; com fio entrega torque constante para uso prolongado sem parar para recarregar.",
      },
      {
        pergunta: "Vale comprar kit de ferramentas?",
        resposta:
          "Para quem está montando a primeira caixa, sim: o preço por peça é bem menor. Para reposição pontual, comprar avulso costuma sair melhor.",
      },
    ],
    match: byKeywords([
      "furadeira",
      "parafusadeira",
      "ferramenta",
      "chave de fenda",
      "serra",
      "martelo",
      "alicate",
    ]),
  },
];

export const getCategoryHub = (slug: string) =>
  CATEGORY_HUBS.find((h) => h.slug === slug);

/* ----------------------------------- Marcas ----------------------------------- */

export const BRANDS = [
  "Samsung",
  "Xiaomi",
  "Apple",
  "Motorola",
  "LG",
  "Nike",
  "Adidas",
  "Philips",
  "Mondial",
  "Electrolux",
  "JBL",
  "Sony",
  "Logitech",
  "Multilaser",
  "Positivo",
  "Lenovo",
  "Dell",
  "Acer",
  "Asus",
  "Havaianas",
  "Nivea",
  "Colgate",
  "Bosch",
  "Tramontina",
];

export const brandSlug = (brand: string) => norm(brand).replace(/\s+/g, "-");

export function detectBrand(titulo: string): string | null {
  const t = norm(titulo);
  return BRANDS.find((b) => t.includes(norm(b))) ?? null;
}

export function getBrandBySlug(slug: string): string | null {
  return BRANDS.find((b) => brandSlug(b) === slug) ?? null;
}

/* ----------------------------------- Lojas ------------------------------------ */

export const STORES = [
  { slug: "shopee", name: "Shopee", host: "shopee" },
  { slug: "amazon", name: "Amazon", host: "amazon" },
  { slug: "mercado-livre", name: "Mercado Livre", host: "mercadoliv" },
  { slug: "magalu", name: "Magalu", host: "magazine" },
  { slug: "netshoes", name: "Netshoes", host: "netshoes" },
  { slug: "aliexpress", name: "AliExpress", host: "aliexpress" },
];

export function detectStore(link: string) {
  const l = norm(link);
  return STORES.find((s) => l.includes(s.host)) ?? null;
}

export const getStoreBySlug = (slug: string) => STORES.find((s) => s.slug === slug);

/* ------------------------------ Páginas de intenção ---------------------------- */

export interface IntentHub {
  path: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  apply: (deals: Deal[]) => Deal[];
}

export const INTENT_HUBS: IntentHub[] = [
  {
    path: "/ofertas-ate-100",
    h1: "Ofertas até R$ 100",
    title: "Ofertas Até R$ 100 — Promoções Baratas de Hoje | CashLua",
    description:
      "Lista atualizada de promoções com preço até R$ 100: achados baratos em eletrônicos, casa, moda e beleza.",
    intro:
      "Esta página reúne automaticamente todas as ofertas ativas do CashLua com preço final até R$ 100. É a faixa onde estão os achados de acessórios, itens de casa e produtos de reposição — categorias em que o desconto percentual costuma ser mais agressivo. A lista muda conforme novas promoções entram na nossa base.",
    apply: (deals) =>
      deals
        .filter((d) => {
          const p = parsePrecoNumber(d.preco);
          return p > 0 && p <= 100;
        })
        .sort((a, b) => parsePrecoNumber(a.preco) - parsePrecoNumber(b.preco)),
  },
  {
    path: "/ofertas-ate-50",
    h1: "Ofertas até R$ 50",
    title: "Ofertas Até R$ 50 — Promoções Muito Baratas | CashLua",
    description:
      "Promoções com preço até R$ 50 atualizadas diariamente. Achados baratos para completar o carrinho.",
    intro:
      "Ofertas de até R$ 50 são as mais usadas para completar carrinho e atingir frete grátis. Aqui listamos tudo o que está ativo na nossa base dentro dessa faixa, ordenado do mais barato para o mais caro.",
    apply: (deals) =>
      deals
        .filter((d) => {
          const p = parsePrecoNumber(d.preco);
          return p > 0 && p <= 50;
        })
        .sort((a, b) => parsePrecoNumber(a.preco) - parsePrecoNumber(b.preco)),
  },
  {
    path: "/mais-baratas",
    h1: "As ofertas mais baratas do momento",
    title: "Ofertas Mais Baratas do Dia | CashLua",
    description:
      "As promoções de menor preço ativas agora no CashLua, ordenadas do mais barato para o mais caro.",
    intro:
      "Ranking automático das promoções de menor preço na nossa base neste momento. Como o CashLua agrega ofertas de várias lojas, essa lista serve como um termômetro rápido do que está realmente barato hoje.",
    apply: (deals) =>
      [...deals]
        .filter((d) => parsePrecoNumber(d.preco) > 0)
        .sort((a, b) => parsePrecoNumber(a.preco) - parsePrecoNumber(b.preco)),
  },
  {
    path: "/top-100-semana",
    h1: "Top 100 ofertas da semana",
    title: "Top 100 Ofertas da Semana | CashLua",
    description:
      "As 100 promoções mais recentes selecionadas nesta semana no CashLua, em uma única página.",
    intro:
      "Reunimos as 100 ofertas mais recentes que entraram na base do CashLua. É a forma mais rápida de ver, de uma vez, o que apareceu de novo nos últimos dias sem precisar rolar o feed inteiro.",
    apply: (deals) =>
      [...deals]
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 100),
  },
];

export const getIntentHub = (path: string) =>
  INTENT_HUBS.find((h) => h.path === path);
