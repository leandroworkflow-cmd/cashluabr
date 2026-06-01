import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Termos de Uso - CashLua"
        description="Leia os Termos de Uso da CashLua. Ao utilizar nossa plataforma, você concorda com as regras descritas neste documento."
        path="/termos"
      />
      <Header search="" onSearchChange={() => {}} />

      <main className="flex-1">
        <div className="container py-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
                Termos de Uso
              </h1>
              <p className="text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6 text-muted-foreground leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e utilizar o site CashLua, você concorda em cumprir e ficar vinculado aos presentes Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize nossos serviços.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">2. Descrição do Serviço</h2>
                <p>
                  A CashLua é uma plataforma de agregação de ofertas, cupons de desconto e promoções. Não vendemos produtos diretamente. As compras são realizadas nos sites dos parceiros e fornecedores, sob suas próprias condições.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">3. Precisão das Informações</h2>
                <p>
                  Fazemos o possível para manter as ofertas atualizadas e precisas. No entanto, preços e disponibilidade podem mudar sem aviso prévio. Recomendamos sempre verificar as condições finais no site do vendedor antes de concluir a compra.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">4. Links de Afiliados</h2>
                <p>
                  Alguns links presentes em nossa plataforma são links de afiliados. Isso significa que podemos receber uma comissão caso você realize uma compra através desses links, sem nenhum custo adicional para você.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">5. Conduta do Usuário</h2>
                <p>
                  Ao utilizar a CashLua, você se compromete a não utilizar a plataforma para fins ilegais, fraudulentos ou que possam causar danos a terceiros. Reservamo-nos o direito de suspender o acesso de usuários que violem esta regra.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">6. Limitação de Responsabilidade</h2>
                <p>
                  A CashLua não se responsabiliza por problemas nas compras realizadas em sites de terceiros, incluindo mas não se limitando a: atrasos na entrega, defeitos de produtos, cancelamentos de pedidos ou questões de atendimento ao cliente.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">7. Alterações nos Termos</h2>
                <p>
                  Podemos atualizar estes Termos de Uso periodicamente. Recomendamos que você revise esta página regularmente para se manter informado sobre quaisquer mudanças.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">8. Contato</h2>
                <p>
                  Em caso de dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail cashlua@gmail.com ou pelo telefone (31) 98373-3004.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
