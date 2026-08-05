import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Moon, Target, SearchCheck, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Quem Somos - CashLua"
        description="Conheça a CashLua. Nosso propósito é conectar brasileiros às melhores ofertas, cupons e promoções do mercado."
        path="/sobre"
      />
      <Header search="" onSearchChange={() => {}} />

      <main className="flex-1">
        <div className="container py-10 space-y-10">
          {/* Hero */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
              <Moon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
              Quem Somos
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              A CashLua nasceu com um propósito claro: transformar a forma como os brasileiros encontram promoções. Somos uma plataforma que reúne as melhores ofertas, cupons de desconto e achados do dia em um só lugar.
            </p>
          </div>

          {/* Missão / Visão / Valores */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-heading font-bold text-foreground">Missão</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Conectar pessoas a economia real. Queremos que cada visita à CashLua resulte em uma compra mais inteligente e com mais valor.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <SearchCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-heading font-bold text-foreground">Seleção</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organizamos ofertas publicadas por lojas e parceiros para tornar a pesquisa mais simples. A decisão final de compra e a conferência das condições são sempre do usuário.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-heading font-bold text-foreground">Transparência</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Informamos quando links podem gerar comissão e lembramos que preço, estoque e frete podem mudar no site da loja.
              </p>
            </div>
          </div>

          {/* História */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-heading font-bold text-foreground">Nossa História</h2>
            <p className="text-muted-foreground leading-relaxed">
              A CashLua é um portal brasileiro independente de comparação e descoberta de promoções. Reunimos ofertas de diferentes varejistas e produzimos guias para ajudar o consumidor a avaliar preço, condições e segurança antes da compra.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Estamos sempre atentos ao mercado, buscando as melhores oportunidades em eletrodomésticos, eletrônicos, moda, beleza e muito mais. Nosso compromisso é com a economia do brasileiro.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
