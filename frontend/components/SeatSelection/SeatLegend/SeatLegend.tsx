import type { TicketTier } from "@/data/events";

const TIER_COLORS: Record<number, { bg: string }> = {
  0: { bg: "#7c3aed" },
  1: { bg: "#2563eb" },
  2: { bg: "#059669" },
  3: { bg: "#d97706" },
};

const getTierColor = (index: number) => TIER_COLORS[index % 4];

type Props = {
  tiers: TicketTier[];
};

const SeatLegend = ({ tiers }: Props) => {
  return (
    <div className="px-4 py-2 border-b border-white/8 flex flex-wrap gap-3">
      {tiers.map((tier, index) => {
        const color = getTierColor(index);

        return (
          <div key={tier.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color.bg }}
            />
            <span className="text-gray-400 text-xs">
              {tier.name}{" "}
              <span className="text-orange-400">
                {Number(tier.price).toLocaleString('vi-VN')}đ
              </span>
            </span>
          </div>
        );
      })}

      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-orange-500" />
        <span className="text-gray-400 text-xs">Đã chọn</span>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-emerald-500" />
        <span className="text-gray-400 text-xs">Đang giữ</span>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-sm bg-gray-700" />
        <span className="text-gray-400 text-xs">Đã bán</span>
      </div>
    </div>
  );
};

export default SeatLegend;