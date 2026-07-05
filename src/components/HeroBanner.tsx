export function HeroBanner() {
  return (
    <section className="w-full pt-4">
      <div className="container">
        <img
          src="/hero-banner.jpg"
          alt="CashLua - Seu agregador de ofertas inteligente. As melhores ofertas, cupons e cashbacks em um só lugar."
          className="w-full h-auto block rounded-xl"
          width={1536}
          height={1024}
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
