import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contato - CashLua"
        description="Entre em contato com a CashLua. Tire dúvidas, envie sugestões ou fale conosco sobre parcerias e ofertas."
        path="/contato"
      />
      <Header search="" onSearchChange={() => {}} />

      <main className="flex-1">
        <div className="container py-10 space-y-10">
          {/* Hero */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
              Fale Conosco
            </h1>
            <p className="text-muted-foreground text-lg">
              Tem alguma dúvida, sugestão ou quer enviar uma oferta? Entre em contato com a gente.
            </p>
          </div>

          {/* Informações de contato */}
          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
            <a
              href="tel:31983733004"
              className="rounded-xl border border-border bg-card p-6 flex items-start gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-foreground">Telefone</h2>
                <p className="text-muted-foreground mt-1">(31) 98373-3004</p>
              </div>
            </a>

            <a
              href="mailto:cashlua@gmail.com"
              className="rounded-xl border border-border bg-card p-6 flex items-start gap-4 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-foreground">E-mail</h2>
                <p className="text-muted-foreground mt-1">cashlua@gmail.com</p>
              </div>
            </a>

            <div className="rounded-xl border border-border bg-card p-6 flex items-start gap-4 sm:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-foreground">Endereço</h2>
                <p className="text-muted-foreground mt-1">
                  Rua Imperatriz Leopoldina, 205<br />
                  Chácara del Rey, Santa Luzia — MG
                </p>
              </div>
            </div>
          </div>

          {/* Canal no WhatsApp */}
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 max-w-3xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-success" />
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground">Canal no WhatsApp</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Siga nosso canal no WhatsApp para receber as melhores ofertas em primeira mão. Fique por dentro das promoções antes de todo mundo!
            </p>
            <a
              href="https://whatsapp.com/channel/0029VbCUmaZA2pLGCnyYDb2L"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-success px-5 py-3 font-heading text-sm font-bold text-white shadow-sm transition-all hover:brightness-110"
            >
              <MessageCircle className="h-4 w-4" />
              Acessar Canal no WhatsApp
            </a>
          </div>

          {/* Horário */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Respondemos o mais rápido possível, de segunda a sábado.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
