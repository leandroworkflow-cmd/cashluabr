import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

import { User } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Meu Perfil | CashLua"
        description="Área do usuário CashLua."
        path="/perfil"
      />
      <meta name="robots" content="noindex, follow" />
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
                <p className="text-sm text-muted-foreground">Você está navegando como visitante.</p>
              </div>
            </div>

            <p className="mt-6 rounded-lg bg-secondary p-4 text-sm text-muted-foreground">
              O CashLua não exige cadastro para consultar ofertas. Seus votos e comentários ficam salvos apenas neste dispositivo.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
