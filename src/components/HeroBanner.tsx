export function HeroBanner() {
  return (
    <section className="w-full pt-3">
      <div className="container">
        <div className="w-full rounded-xl overflow-hidden bg-primary/10">
          <img
            src="/hero-banner.jpg"
            alt="CashLua - Seu agregador de ofertas inteligente. As melhores ofertas, cupons e cashbacks em um só lugar."
            className="w-full h-auto aspect-[16/9] md:aspect-[20/9] lg:aspect-[24/9] object-cover block"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
