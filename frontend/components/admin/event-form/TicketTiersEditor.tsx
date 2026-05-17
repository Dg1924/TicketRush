import { Plus } from "lucide-react";
import type { TicketTier } from "@/data/events";
import TicketTierCard from "./TicketTierCard";

type Props = {
  tiers: TicketTier[];
  onAddTier: () => void;
  onRemoveTier: (index: number) => void;
  onChangeTier: (
    index: number,
    key: keyof TicketTier,
    value: unknown
  ) => void;
};

const TicketTiersEditor = ({
  tiers,
  onAddTier,
  onRemoveTier,
  onChangeTier,
}: Props) => {
  return (
    <section className="bg-[#12121e] border border-white/8 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white">Ticket Tiers</h3>

        <button
          type="button"
          onClick={onAddTier}
          className="flex items-center gap-1.5 text-orange-400 text-xs hover:text-orange-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Tier
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tiers.map((tier, index) => (
          <TicketTierCard
            key={tier.id}
            tier={tier}
            index={index}
            canRemove={tiers.length > 1}
            onRemove={() => onRemoveTier(index)}
            onChange={(key, value) => onChangeTier(index, key, value)}
          />
        ))}
      </div>
    </section>
  );
};

export default TicketTiersEditor;
