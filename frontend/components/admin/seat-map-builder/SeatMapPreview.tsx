import { memo, useMemo } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import type { SeatMapConfig } from "@/store/AppContext";
import { getTierColor } from "./seatMapTheme";

type BookedSeat = {
  id: string | number;
  seat: string;
  status: "pending" | "paid" | "locked" | string;
  createdAt?: string;
  buyerName?: string;
  buyerEmail?: string;
  tierName?: string;
  price?: number | string;
};

type Props = {
  config: SeatMapConfig;
  tierIndexMap: Record<string, number>;
  editMode: boolean;
  bookedSeats?: BookedSeat[];
  onToggleSeat: (rowLabel: string, seatNumber: number) => void;
  onToggleEditMode: () => void;
};

const formatStatus = (status?: string) => {
  if (status === "paid") return "Đã bán";
  if (status === "pending") return "Đang giữ";
  if (status === "locked") return "Đang giữ";
  return status || "Không rõ";
};

const formatDateTime = (value?: string) => {
  if (!value) return "Không rõ";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Không rõ";

  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getSeatMapEventId = (config: SeatMapConfig) => {
  return String((config as any).eventId || (config as any).id || "");
};

const SeatMapPreview = ({
  config,
  tierIndexMap,
  editMode,
  bookedSeats = [],
  onToggleSeat,
  onToggleEditMode,
}: Props) => {
  const eventId = getSeatMapEventId(config);

  const rows = useMemo(() => {
    return Array.isArray(config.rows) ? config.rows : [];
  }, [config.rows]);

  const bookedSeatMap = useMemo(() => {
    const map = new Map<string, BookedSeat>();

    bookedSeats.forEach((ticket) => {
      if (ticket.seat) {
        map.set(String(ticket.seat), ticket);
      }
    });

    return map;
  }, [bookedSeats]);

  const soldCount = useMemo(() => {
    return bookedSeats.filter((item) => item.status === "paid").length;
  }, [bookedSeats]);

  const heldCount = useMemo(() => {
    return bookedSeats.filter(
      (item) => item.status === "pending" || item.status === "locked"
    ).length;
  }, [bookedSeats]);

  const helperText = editMode
    ? "Nhấn vào ghế trống để bật/tắt khóa ghế. Ghế đã bán hoặc đang giữ không thể chỉnh."
    : "Chế độ xem quản lý — bấm ghế đã bán/đang giữ để xem chi tiết";

  const showTicketInfo = (ticket: BookedSeat) => {
    alert(
      `Ghế: ${ticket.seat}\n` +
        `Trạng thái: ${formatStatus(ticket.status)}\n` +
        `Người mua: ${ticket.buyerName || "Không rõ"}\n` +
        `Email: ${ticket.buyerEmail || "Không rõ"}\n` +
        `Hạng vé: ${ticket.tierName || "Không rõ"}\n` +
        `Giá: ${Number(ticket.price || 0).toLocaleString("vi-VN")}đ\n` +
        `Thời gian đặt: ${formatDateTime(ticket.createdAt)}`
    );
  };

  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3.5 bg-white/2 border-b border-white/8">
        <div>
          <h3 className="text-white text-sm font-medium">Sơ đồ ghế quản lý</h3>

          <p className="text-gray-500 text-[11px] mt-0.5">
            Đã bán:{" "}
            <span className="text-slate-300 font-semibold">{soldCount}</span>
            {" · "}
            Đang giữ:{" "}
            <span className="text-emerald-400 font-semibold">{heldCount}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wider">
            <Info className="w-3 h-3" />
            {editMode ? "Đang chỉnh sửa" : "Đang xem"}
          </div>

          <button
            type="button"
            onClick={onToggleEditMode}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
              editMode
                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
            }`}
          >
            {editMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Tắt chỉnh sửa
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                Chỉnh sửa ghế
              </>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-wrap gap-4 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[3px] bg-emerald-500" />
          Đang giữ
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[3px] bg-slate-700" />
          Đã bán
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[3px] bg-gray-800 opacity-40" />
          Ghế khóa
        </div>
      </div>

      <div className="p-4 overflow-x-auto">
        <div className="min-w-max flex flex-col items-center py-6">
          <div className="mb-8 w-full max-w-md">
            <div className="h-10 bg-gradient-to-b from-orange-500/30 to-transparent rounded-t-full blur-xl opacity-50" />

            <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl py-2 text-center text-orange-300 text-xs font-bold tracking-[0.35em] uppercase -mt-6 relative z-10">
              {config.stageName || "STAGE"}
            </div>
          </div>

          {rows.map((row) => {
            const tierIndex = tierIndexMap[String(row.tierId)] ?? 0;
            const color = getTierColor(tierIndex);
            const seats = Array.from(
              { length: Number(row.seats || 0) },
              (_, index) => index + 1
            );

            const disabledSeats = Array.isArray(row.disabled)
              ? row.disabled.map((item) => Number(item))
              : [];

            return (
              <div key={row.label} className="flex items-center gap-3 mb-1.5">
                <span className="text-gray-600 text-[10px] w-6 font-mono font-bold text-right">
                  {row.label}
                </span>

                <div className="flex gap-1">
                  {seats.map((seatNumber) => {
                    const seatId = `${eventId}_${row.label}_${seatNumber}`;
                    const ticket = bookedSeatMap.get(seatId);

                    const isDisabled = disabledSeats.includes(seatNumber);
                    const isSold = ticket?.status === "paid";
                    const isHeld =
                      ticket?.status === "pending" ||
                      ticket?.status === "locked";

                    const canToggle = editMode && !isSold && !isHeld;

                    const handleSeatClick = () => {
                      if (ticket) {
                        showTicketInfo(ticket);
                        return;
                      }

                      if (canToggle) {
                        onToggleSeat(row.label, seatNumber);
                      }
                    };

                    let backgroundColor = color.bg;
                    let opacity = 1;
                    let boxShadow = `0 0 5px ${color.bg}40`;
                    let cursor = "cursor-default";

                    if (isDisabled) {
                      backgroundColor = "#1f2937";
                      opacity = 0.25;
                      boxShadow = "none";
                    }

                    if (isHeld) {
                      backgroundColor = "#10b981";
                      opacity = 1;
                      boxShadow = "0 0 8px rgba(16,185,129,0.45)";
                      cursor = "cursor-pointer";
                    }

                    if (isSold) {
                      backgroundColor = "#334155";
                      opacity = 1;
                      boxShadow = "none";
                      cursor = "cursor-pointer";
                    }

                    if (canToggle) {
                      cursor = "cursor-pointer hover:scale-125 hover:z-10";
                    }

                    return (
                      <button
                        key={`${row.label}-${seatNumber}`}
                        type="button"
                        title={
                          ticket
                            ? `${seatId} - ${formatStatus(ticket.status)} - ${
                                ticket.buyerName || "Không rõ"
                              }`
                            : isDisabled
                            ? `${seatId} - Ghế khóa`
                            : `${seatId} - Ghế trống`
                        }
                        onClick={handleSeatClick}
                        className={`w-4 h-4 rounded-[3px] transition-all duration-75 ${cursor}`}
                        style={{
                          backgroundColor,
                          boxShadow,
                          opacity,
                        }}
                      />
                    );
                  })}
                </div>

                <span className="text-gray-600 text-[10px] w-6 font-mono font-bold">
                  {row.label}
                </span>
              </div>
            );
          })}

          <div className="text-gray-500 text-[10px] mt-8 uppercase tracking-widest animate-pulse">
            {helperText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SeatMapPreview);