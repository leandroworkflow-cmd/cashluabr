import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Digite seu e-mail")
  .email("E-mail inválido")
  .max(255, "E-mail muito longo");

interface NewsletterFormProps {
  source?: string;
}

export function NewsletterForm({ source = "ofertas-do-dia" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast({ title: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.toLowerCase(), source });
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        setDone(true);
        toast({ title: "Você já está inscrito! 🎉" });
        return;
      }
      toast({
        title: "Erro ao inscrever",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setDone(true);
    toast({ title: "Inscrição confirmada! 🔥", description: "Você receberá as melhores ofertas." });
  };

  return (
    <section className="rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card to-hot/10 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="font-heading text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Receba as ofertas do dia no seu e-mail
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Curadoria diária das promoções mais quentes. Sem spam.
          </p>
        </div>

        {done ? (
          <div className="flex items-center gap-2 text-success font-heading font-bold text-sm">
            <CheckCircle2 className="h-5 w-5" />
            Inscrito com sucesso!
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              maxLength={255}
              className="flex-1 sm:w-64 rounded-lg bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 font-heading text-sm font-bold text-primary-foreground shadow-sm hover:brightness-110 disabled:opacity-60 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Inscrever"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
