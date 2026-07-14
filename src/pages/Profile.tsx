import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

import { User, Flame, MessageCircle, Clock } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Meu Perfil | CashLua"
        description="Veja seu perfil no CashLua: ofertas compartilhadas, comentários e atividade na comunidade de promoções."
        path="/perfil"
      />
      <Header search={search} onSearchChange={setSearch} />


      <main className="flex-1">
        <div className="container py-8 max-w-2xl">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl text-foreground">Usuário</h1>
                <p className="text-sm text-muted-foreground">Membro desde 2025</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: Flame, label: "Ofertas", value: "12" },
                { icon: MessageCircle, label: "Comentários", value: "48" },
                { icon: Clock, label: "Dias ativo", value: "30" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-3 bg-secondary rounded-lg">
                  <Icon className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="text-lg font-heading font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
