export function HeroBanner() {
  return (
    <section className="w-full pt-3">
      <div className="container">
        <div className="w-full rounded-xl overflow-hidden">
          <img
            src="/hero-banner.jpg"
            alt="CashLua - Seu agregador de ofertas inteligente. As melhores ofertas, cupons e cashbacks em um só lugar."
            className="w-full h-auto max-h-[260px] object-contain block"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
