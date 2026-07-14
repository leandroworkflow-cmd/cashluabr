import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Redirect = () => {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError("Código inválido");
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from("short_links")
        .select("url")
        .eq("code", code)
        .maybeSingle();

      if (error || !data?.url) {
        setError("Link não encontrado");
        return;
      }

      // Incrementa contador de cliques (não bloqueia o redirect)
      supabase.rpc("increment_short_link_click", { _code: code }).then(() => {});

      window.location.replace(data.url);
    })();
  }, [code]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-foreground">
      {error ? (
        <>
          <p className="text-lg font-heading font-bold">{error}</p>
          <a href="/" className="text-primary underline text-sm">
            Voltar para o início
          </a>
        </>
      ) : (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </>
      )}
    </div>
  );
};

export default Redirect;
