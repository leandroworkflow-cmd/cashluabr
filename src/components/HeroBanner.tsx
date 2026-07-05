import bannerAsset from "@/assets/cashlua-hero-banner.png.asset.json";

export function HeroBanner() {
  return (
    <section className="w-full">
      <div className="container py-4">
        <img
          src={bannerAsset.url}
          alt="CashLua - Seu agregador de ofertas inteligente"
          className="w-full h-auto rounded-xl shadow-md"
          loading="eager"
        />
      </div>
    </section>
  );
}
