import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useDeals } from "@/hooks/useDeals";
import { Flame, ExternalLink, ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, Share2, Tag, Calendar, Store } from "lucide-react";
import { shortenUrl } from "@/lib/shorten";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}


const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [search, setSearch] = useState("");
  const { data: deals, isLoading } = useDeals();
  const deal = deals?.find((d) => d.id === id);

  const storageKey = `deal-engagement-${id}`;
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [tempBoost, setTempBoost] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        setVote(data.vote ?? null);
        setTempBoost(data.tempBoost ?? 0);
        setComments(data.comments ?? []);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const persist = (next: { vote?: "up" | "down" | null; tempBoost?: number; comments?: Comment[] }) => {
    const merged = {
      vote: next.vote !== undefined ? next.vote : vote,
      tempBoost: next.tempBoost !== undefined ? next.tempBoost : tempBoost,
      comments: next.comments !== undefined ? next.comments : comments,
    };
    localStorage.setItem(storageKey, JSON.stringify(merged));
  };

  const handleVote = (type: "up" | "down") => {
    let newVote: "up" | "down" | null = type;
    let delta = type === "up" ? 10 : -10;
    if (vote === type) {
      newVote = null;
      delta = type === "up" ? -10 : 10;
    } else if (vote && vote !== type) {
      delta = type === "up" ? 20 : -20;
    }
    const newBoost = tempBoost + delta;
    setVote(newVote);
    setTempBoost(newBoost);
    persist({ vote: newVote, tempBoost: newBoost });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) {
      toast.error("Preencha seu nome e comentário");
      return;
    }
    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: authorName.trim(),
      text: commentText.trim(),
      date: new Date().toLocaleString("pt-BR"),
    };
    const next = [newComment, ...comments];
    setComments(next);
    setCommentText("");
    persist({ comments: next });
    toast.success("Comentário publicado!");
  };

  const displayTemp = (deal?.temperatura || 0) + tempBoost;
  const totalComments = (deal?.comentarios || 0) + comments.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header search={search} onSearchChange={setSearch} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-heading font-bold text-foreground">Oferta não encontrada</h1>
            <Link to="/" className="text-primary hover:underline text-sm">
              Voltar ao feed
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={`${deal.titulo} - R$ ${deal.preco} | CashLua`}
        description={`${deal.titulo} por R$ ${deal.preco} na ${deal.loja || "loja"}. Confira essa oferta quente no CashLua.`}
        path={`/oferta/${deal.id}`}
        image={deal.imagem || undefined}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: deal.titulo,
          image: deal.imagem,
          offers: {
            "@type": "Offer",
            price: deal.preco,
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            url: deal.link,
            seller: { "@type": "Organization", name: deal.loja || "Loja" },
          },
        }}
      />
      <Header search={search} onSearchChange={setSearch} />


      <main className="flex-1">
        <div className="container py-6 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>

          <article className="bg-card rounded-lg border border-border overflow-hidden">
            {/* Image */}
            {deal.imagem && (
              <div className="bg-secondary/30 flex items-center justify-center p-6 max-h-80">
                <img
                  src={deal.imagem}
                  alt={deal.titulo}
                  className="max-h-64 object-contain"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-medium">
                  {deal.loja || "Loja"}
                </span>
                <span className="text-muted-foreground">{deal.data}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground leading-snug">
                {deal.titulo}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-heading font-extrabold text-foreground">
                  R$ {deal.preco}
                </span>
                <div className="flex items-center gap-1 text-hot font-bold">
                  <Flame className="h-5 w-5 animate-flame-pulse" />
                  <span>{deal.temperatura || 0}°</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-heading font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all shadow-sm"
                >
                  Pegar Oferta <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    const short = await shortenUrl(deal.link);
                    const text = `🔥 Olha essa oferta: ${deal.titulo} por R$ ${deal.preco}! 👉 ${short}`;
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(text)}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="inline-flex items-center gap-1.5 text-white px-4 py-3 rounded-lg hover:brightness-110 transition-all text-sm font-bold"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <Share2 className="h-4 w-4" /> Compartilhar no WhatsApp
                </button>
              </div>

              {/* Votes */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-success transition-colors">
                  <ThumbsUp className="h-5 w-5" /> Curtir
                </button>
                <button className="flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors">
                  <ThumbsDown className="h-5 w-5" /> Não curtir
                </button>
              </div>
            </div>
          </article>

          {/* Comments section */}
          <section className="mt-6 bg-card rounded-lg border border-border p-6">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5" /> Comentários ({deal.comentarios || 0})
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Seja o primeiro a comentar sobre esta oferta!
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DealDetail;
