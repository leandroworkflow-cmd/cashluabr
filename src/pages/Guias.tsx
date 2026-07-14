import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Lightbulb, ShoppingCart, CalendarClock, ShieldAlert, Wallet, Percent } from "lucide-react";

const articles = [
  {
    slug: "como-saber-se-uma-oferta-e-boa",
    icon: Lightbulb,
    title: "Como saber se uma oferta é realmente boa (e não só parece)",
    excerpt:
      "Nem todo desconto é vantagem. Aprenda a checar histórico de preço, comparar lojas e identificar quando um 'desconto' é só marketing.",
    readingTime: "5 min",
  },
  {
    slug: "melhores-epocas-para-comprar-eletronicos",
    icon: CalendarClock,
    title: "As melhores épocas do ano para comprar eletrônicos no Brasil",
    excerpt:
      "Black Friday não é a única data que importa. Veja o calendário de quedas de preço em celulares, notebooks e eletrodomésticos.",
    readingTime: "6 min",
  },
  {
    slug: "cupom-de-desconto-vale-a-pena",
    icon: Percent,
    title: "Cupom de desconto: quando vale a pena usar (e quando é pegadinha)",
    excerpt:
      "Cupons com regras confusas, valor mínimo alto ou prazo curtíssimo podem custar mais caro que parecem economizar. Entenda os sinais de alerta.",
    readingTime: "4 min",
  },
  {
    slug: "como-comprar-com-seguranca-online",
    icon: ShieldAlert,
    title: "Como comprar com segurança em lojas online desconhecidas",
    excerpt:
      "Antes de colocar o cartão numa loja nova, verifique estes pontos: CNPJ, reclamações no Reclame Aqui, política de troca e formas de pagamento.",
    readingTime: "5 min",
  },
  {
    slug: "planejar-orcamento-para-compras",
    icon: Wallet,
    title: "Como planejar o orçamento do mês para aproveitar promoções sem se endividar",
    excerpt:
      "Comprar na promoção só é economia se caber no seu orçamento. Um método simples para separar o que é oportunidade do que é impulso.",
    readingTime: "6 min",
  },
  {
    slug: "diferenca-cashback-cupom-oferta",
    icon: ShoppingCart,
    title: "Cashback, cupom ou oferta direta: qual combina mais com você?",
    excerpt:
      "Os três reduzem o valor final, mas funcionam de formas diferentes. Entenda as vantagens e desvantagens de cada modelo de economia.",
    readingTime: "5 min",
  },
];

const Guias = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Guias e Dicas de Economia - CashLua"
        description="Guias práticos para economizar de verdade: como avaliar ofertas, comprar com segurança, usar cupons e planejar seu orçamento."
        path="/guias"
      />
      <Header search="" onSearchChange={() => {}} />

      <main className="flex-1">
        <div className="container py-10 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
              Guias e Dicas de Economia
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Além de reunir ofertas, queremos ajudar você a comprar melhor. Aqui estão nossos
              guias práticos sobre como identificar promoções reais, comprar com segurança e
              fazer o dinheiro render mais.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {articles.map((article) => {
              const Icon = article.icon;
              return (
                <Link
                  key={article.slug}
                  to={`/guias/${article.slug}`}
                  className="rounded-xl border border-border bg-card p-6 space-y-3 hover:border-primary/50 transition-colors flex flex-col"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-heading font-bold text-foreground leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Leitura de {article.readingTime}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guias;
export { articles };
