import { Fragment } from "react";
import { Deal } from "@/lib/types";
import { DealCard } from "@/components/DealCard";
import { AdSlot } from "@/components/AdSlot";
import { ADSENSE_SLOTS } from "@/lib/adsense";

interface DealGridProps {
  deals: Deal[];
  /** Quantas ofertas entre um anúncio e outro. Poucos anúncios, sempre longe dos botões. */
  adEvery?: number;
}

export function DealGrid({ deals, adEvery = 12 }: DealGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
      {deals.map((deal, index) => (
        <Fragment key={deal.id}>
          <DealCard deal={deal} />
          {(index + 1) % adEvery === 0 && index < deals.length - 1 && (
            <div className="col-span-full my-2 empty:hidden">
              <AdSlot slot={ADSENSE_SLOTS.feed} />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
