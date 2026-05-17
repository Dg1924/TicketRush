import type { SeatMapConfig } from "@/store/AppContext";
import type { TicketTier } from "@/data/events";
import type { useApp } from "@/store/AppContext";

const TIER_COLORS: Record<number, { bg: string }> = {
  0: { bg: "#ef4444" },
  1: { bg: "#2563eb" },
  2: { bg: "#16a34a" },
  3: { bg: "#f59e0b" },
  4: { bg: "#9333ea" },
};

const getTierColor = (index: number) => TIER_COLORS[index % 5];

type Props = {
  config: SeatMapConfig;
  tiers: TicketTier[];
  seatStatuses: ReturnType<typeof useApp>["seatStatuses"];
  selectedSeats: string[];
  sessionId: string;
  heldMode: boolean;
  onSeatClick: (seatId: string) => void;
  bookedSeats?: string[];
};

const SeatMap = ({
  config,
  tiers,
  seatStatuses,
  selectedSeats,
  sessionId,
  heldMode,
  onSeatClick,
  bookedSeats = [],
}: Props) => {
  const tierIndexMap: Record<string, number> = {};

  tiers.forEach((tier, index) => {
    tierIndexMap[String(tier.id)] = index;
  });

  const stageNameDisplay =
    config.stageName === "STAGE" ? "SÂN KHẤU" : config.stageName;

  return (
    <div className="min-w-max flex flex-col items-center gap-1 py-4 px-6">
      <div className="w-full max-w-2xl mb-6">
        <div className="relative h-10 rounded-xl bg-gradient-to-r from-orange-500/30 via-orange-400/50 to-orange-500/30 border border-orange-500/40 flex items-center justify-center">
          <span className="text-orange-300 text-xs tracking-[0.3em] font-semibold">
            ★ {stageNameDisplay} ★
          </span>

          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-orange-500/20 blur-md rounded-full" />
        </div>

        <div className="h-4 w-2/3 mx-auto bg-gradient-to-b from-orange-500/10 to-transparent rounded-b-full" />
      </div>

      {config.rows.map((row) => {
        const tierIndex = tierIndexMap[String(row.tierId)] ?? 0;
        const colors = getTierColor(tierIndex);

        return (
          <div
            key={row.id}
            className="flex items-center gap-2 w-full max-w-2xl justify-center"
          >
            <span className="text-gray-500 text-xs w-5 text-right shrink-0 font-mono">
              {row.label}
            </span>

            <div className="flex gap-1 justify-center">
              {Array.from({ length: row.seats }, (_, index) => {
                const seatNumber = index + 1;
                const seatId = `${config.eventId}_${row.label}_${seatNumber}`;

                const isDisabled = row.disabled.includes(seatNumber);
                const status = seatStatuses[seatId];

                const isHeldByMe =
                  status?.status === "held" &&
                  status?.sessionId === sessionId;

                const isHeldByOther =
                  status?.status === "held" &&
                  status?.sessionId !== sessionId;

                const isSelected = selectedSeats.includes(seatId);

                const isSold =
                  status?.status === "sold" || bookedSeats.includes(seatId);

                let bgColor = colors.bg;
                let opacity = "opacity-100";
                let cursor = "cursor-pointer";
                let ring = "";
                let title = `Hàng ${row.label} Ghế ${seatNumber}`;

                if (isDisabled) {
                  bgColor = "#1f2937";
                  opacity = "opacity-40";
                  cursor = "cursor-not-allowed";
                  title += " (Ghế khóa)";
                } else if (isSold) {
                  bgColor = "#374151";
                  opacity = "opacity-50";
                  cursor = "cursor-not-allowed";
                  title += " (Đã bán)";
                } else if (isHeldByOther) {
                  bgColor = "#047857";
                  opacity = "opacity-70";
                  cursor = "cursor-not-allowed";
                  title += " (Đang được người khác giữ)";
                } else if (isHeldByMe) {
                  bgColor = "#10b981";
                  opacity = "opacity-100";
                  cursor = "cursor-not-allowed";
                  ring = "ring-2 ring-emerald-300";
                  title += " (Bạn đang giữ)";
                } else if (isSelected) {
                  bgColor = "#f97316";
                  opacity = "opacity-100";
                  ring = "ring-2 ring-orange-200";
                  title += " · Đã chọn";
                }

                const clickable =
                  !isDisabled &&
                  !isSold &&
                  !isHeldByOther &&
                  !heldMode &&
                  !isHeldByMe;

                return (
                  <button
                    key={seatId}
                    type="button"
                    title={title}
                    disabled={!clickable}
                    onClick={() => clickable && onSeatClick(seatId)}
                    className={`w-5 h-5 rounded-sm transition-all duration-150 ${opacity} ${cursor} ${ring} hover:scale-110 relative`}
                    style={{ backgroundColor: bgColor }}
                  >
                    {isSelected && (
                      <span
                        className="absolute inset-0 flex items-center justify-center text-white"
                        style={{ fontSize: "8px" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <span className="text-gray-500 text-xs w-5 shrink-0 font-mono">
              {row.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SeatMap;