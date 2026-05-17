import type { TicketTier } from "@/data/events";
import type { SeatMapConfig } from "@/store/AppContext";
import { getTierColor } from "./seatMapTheme";

type Props = {
  config: SeatMapConfig;
  tiers: TicketTier[];
  tierIndexMap: Record<string, number>;
  totalSeats: number;
  disabledSeats: number;
};

const SeatMapStats = ({
  config,
  tiers,
  totalSeats,
  disabledSeats,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="bg-[#12121e] border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Tổng số hàng</span>
        <span className="text-white font-mono">{config.rows.length}</span>
      </div>

      <div className="bg-[#12121e] border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Ghế khả dụng</span>
        <span className="text-orange-400 font-mono font-bold">{totalSeats}</span>
      </div>

      <div className="bg-[#12121e] border border-white/8 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <span className="text-gray-500 text-[11px] uppercase font-bold tracking-wider">Ghế đã khóa</span>
        <span className="text-gray-400 font-mono">{disabledSeats}</span>
      </div>

      <div className="flex items-center gap-4 ml-auto flex-wrap pt-2 sm:pt-0">
        {tiers.map((tier, index) => {
          const color = getTierColor(index);
          return (
            <div key={tier.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-[3px] shadow-sm"
                style={{ backgroundColor: color.bg, boxShadow: `0 0 8px ${color.bg}40` }}
              />
              <span className="text-gray-400 text-xs">{tier.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatMapStats;