import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useDeals } from "@/hooks/useDeals";
import { Flame, ExternalLink, ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, Share2, Tag, Calendar, Store } from "lucide-react";
import { shortenUrl } from "@/lib/shorten";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}


const DealDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [search, setSearch] = useState("");
  const { data: deals, isLoading } = useDeals();

  // Find deal by slug first, fallback to extracting ID from the end of the slug
  const deal = deals?.find((d) => d.slug === slug) ||
    (() => {
      const lastSegment = slug?.split("-").pop();
      return lastSegment ? deals?.find((d) => d.id === lastSegment) : undefined;
    })();

  const dealId = deal?.id || slug?.split("-").pop() || slug || "unknown";
  const storageKey = `deal-engagement-${dealId}`;
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [tempBoost, setTempBoost] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!dealId) return;
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
  }, [dealId]);

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
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                  <Store className="h-3.5 w-3.5" /> {deal.loja || "Loja"}
                </span>
                {deal.categoria && (
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                    <Tag className="h-3.5 w-3.5" /> {deal.categoria}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> {deal.data}
                </span>
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
                  <span>{displayTemp}°</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-heading font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all shadow-sm"
                >
                  Ir para a loja <ExternalLink className="h-4 w-4" />
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
                <button
                  onClick={() => handleVote("up")}
                  className={`flex items-center gap-1 transition-colors ${
                    vote === "up" ? "text-success font-bold" : "text-muted-foreground hover:text-success"
                  }`}
                >
                  <ThumbsUp className="h-5 w-5" /> Curtir
                </button>
                <button
                  onClick={() => handleVote("down")}
                  className={`flex items-center gap-1 transition-colors ${
                    vote === "down" ? "text-destructive font-bold" : "text-muted-foreground hover:text-destructive"
                  }`}
                >
                  <ThumbsDown className="h-5 w-5" /> Não curtir
                </button>
              </div>
            </div>
          </article>

          {/* Comments section */}
          <section className="mt-6 bg-card rounded-lg border border-border p-6">
            <h2 className="font-heading font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="h-5 w-5" /> Comentários ({totalComments})
            </h2>

            <form onSubmit={handleAddComment} className="mt-4 space-y-3">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={40}
              />
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário sobre esta oferta..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                maxLength={500}
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-heading font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Publicar comentário
              </button>
            </form>

            <div className="mt-6 space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Seja o primeiro a comentar sobre esta oferta!
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-sm text-foreground">{c.author}</span>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DealDetail;
