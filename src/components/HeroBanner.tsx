export function HeroBanner() {
  return (
    <section className="w-full overflow-hidden">
      <img
        src="/hero-banner.jpg"
        alt="CashLua - Seu agregador de ofertas inteligente. As melhores ofertas, cupons e cashbacks em um só lugar."
        className="w-full h-[140px] sm:h-[220px] md:h-[280px] lg:h-[340px] object-cover object-[center_25%] block"
        width={1717}
        height={916}
        fetchPriority="high"
      />
    </section>
  );
}
