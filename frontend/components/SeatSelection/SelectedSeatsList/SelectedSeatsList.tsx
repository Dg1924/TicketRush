import { X } from "lucide-react";
import type { Event } from "@/data/events";
import type { SeatMapConfig } from "@/store/AppContext";

const TIER_COLORS: Record<number, { bg: string }> = {
  0: { bg: "#7c3aed" },
  1: { bg: "#2563eb" },
  2: { bg: "#059669" },
  3: { bg: "#d97706" },
};

const getTierColor = (index: number) => TIER_COLORS[index % 4];

type Props = {
  event: Event;
  config: SeatMapConfig;
  seats: string[];
  heldMode: boolean;
  onRemoveSeat: (seatId: string) => void;
};

const SelectedSeatsList = ({
  event,
  config,
  seats,
  heldMode,
  onRemoveSeat,
}: Props) => {
  const getSeatTier = (seatId: string) => {
    const [, rowLabel] = seatId.split("_");

    const row = config.rows.find(
      (item) => String(item.label) === String(rowLabel)
    );

    if (!row) return event.tiers?.[0];

    return (
      event.tiers.find(
        (item: any) =>
          String(item.id) === String(row.tierId) ||
          String(item._id) === String(row.tierId)
      ) || event.tiers?.[0]
    );
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      {seats.map((seatId) => {
        const [, rowLabel, seatNumber] = seatId.split("_");

        const tier = getSeatTier(seatId);

        const tierIndex = tier
          ? event.tiers.findIndex(
              (item: any) =>
                String(item.id) === String(tier.id) ||
                String(item._id) === String(tier._id)
            )
          : 0;

        const colors = getTierColor(tierIndex >= 0 ? tierIndex : 0);

        return (
          <div
            key={seatId}
            className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ backgroundColor: colors.bg }}
              />

              <span className="text-white text-xs">
                Hàng {rowLabel}, Ghế {seatNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-orange-400 text-xs font-medium">
                {Number(tier?.price || 0).toLocaleString("vi-VN")}đ
              </span>

              {!heldMode && (
                <button
                  type="button"
                  onClick={() => onRemoveSeat(seatId)}
                  className="text-gray-600 hover:text-red-400 transition-colors"
                  title="Xóa ghế này"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedSeatsList;