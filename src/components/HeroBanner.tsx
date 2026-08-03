export function HeroBanner() {
  return (
    <section className="w-full pt-3">
      <div className="container">
        <div className="w-full max-h-[220px] sm:max-h-[260px] md:max-h-[320px] lg:max-h-[360px] overflow-hidden rounded-xl">
          <img
            src="/hero-banner.jpg"
            alt="CashLua - Seu agregador de ofertas inteligente. As melhores ofertas, cupons e cashbacks em um só lugar."
            className="w-full h-full object-cover object-center block"
            width={1536}
            height={1024}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}
