import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Flame, Target, Users, ShieldCheck } from "lucide-react";

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
              <Flame className="h-8 w-8 text-primary" />
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
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-heading font-bold text-foreground">Comunidade</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nossas ofertas são curadas e validadas pela comunidade. Acreditamos no poder da colaboração para encontrar os melhores preços.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-heading font-bold text-foreground">Transparência</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trabalhamos com honestidade. Indicamos apenas lojas confiáveis e promoções reais, sem enganação.
              </p>
            </div>
          </div>

          {/* História */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-xl font-heading font-bold text-foreground">Nossa História</h2>
            <p className="text-muted-foreground leading-relaxed">
              A CashLua começou como um grupo de amigos compartilhando promoções em um canal no WhatsApp. Com o tempo, percebemos que havia uma demanda enorme por um espaço organizado e confiável para encontrar ofertas. Hoje, evoluímos para uma plataforma completa, mas mantemos a essência de comunidade e proximidade com nossos usuários.
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
