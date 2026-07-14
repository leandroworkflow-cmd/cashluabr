import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Política de Privacidade - CashLua"
        description="Conheça a Política de Privacidade da CashLua. Saiba como tratamos seus dados e protegemos sua privacidade."
        path="/privacidade"
      />
      <Header search="" onSearchChange={() => {}} />

      <main className="flex-1">
        <div className="container py-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
                Política de Privacidade
              </h1>
              <p className="text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6 text-muted-foreground leading-relaxed">
              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">1. Introdução</h2>
                <p>
                  A CashLua respeita sua privacidade e está comprometida em proteger os dados pessoais que você compartilha conosco. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">2. Dados que Coletamos</h2>
                <p>
                  Podemos coletar informações como nome, e-mail e dados de navegação quando você interage com nossa plataforma. Também utilizamos cookies para melhorar sua experiência de uso.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">3. Uso das Informações</h2>
                <p>
                  Os dados coletados são utilizados para:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Personalizar sua experiência na plataforma</li>
                  <li>Enviar ofertas e promoções relevantes</li>
                  <li>Melhorar nossos serviços e conteúdo</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">4. Compartilhamento de Dados</h2>
                <p>
                  Não vendemos seus dados pessoais a terceiros. Podemos compartilhar informações apenas com parceiros de confiança que nos auxiliam na operação da plataforma, sempre sob rigorosas cláusulas de confidencialidade.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">5. Cookies e Tecnologias Semelhantes</h2>
                <p>
                  Utilizamos cookies para armazenar preferências, analisar tráfego e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">5.1. Publicidade e Google AdSense</h2>
                <p>
                  A CashLua utiliza o Google AdSense para exibir anúncios em nosso site. O Google, como fornecedor terceirizado, usa cookies (como o cookie DART) para veicular anúncios com base nas visitas anteriores do usuário a este e a outros sites. O uso do cookie DART pelo Google permite exibir anúncios com base na navegação do usuário na internet.
                </p>
                <p>
                  Você pode desativar o uso do cookie DART visitando a{" "}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-foreground"
                  >
                    Política de Anúncios do Google
                  </a>
                  , e gerenciar suas preferências de anúncios personalizados nas{" "}
                  <a
                    href="https://adssettings.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-foreground"
                  >
                    Configurações de Anúncios do Google
                  </a>
                  . Terceiros, incluindo o Google, também podem usar cookies para veicular anúncios com base em visitas anteriores de um usuário ao nosso site ou a outros sites.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">6. Segurança</h2>
                <p>
                  Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, alterações, divulgações ou destruição.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">7. Seus Direitos</h2>
                <p>
                  Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais. Para exercer esses direitos, entre em contato conosco pelo e-mail cashlua@gmail.com.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">8. Alterações na Política</h2>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas através de nossa plataforma.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-heading font-bold text-foreground">9. Contato</h2>
                <p>
                  Se tiver dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail cashlua@gmail.com ou pelo telefone (31) 98373-3004.
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

export default Privacy;
