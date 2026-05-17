import { Trash2, Lock } from "lucide-react";
import type { SeatRowConfig } from "@/store/AppContext";
import { getTierColor } from "./seatMapTheme";

type Props = {
  row: SeatRowConfig;
  tierIndex: number;
  tierOptions: { id: string; name: string }[];
  hasBookedSeats?: boolean;
  onChangeSeats: (value: number) => void;
  onChangeTier: (tierId: string) => void;
  onRemove: () => void;
};

const SeatRowEditor = ({
  row,
  tierIndex,
  tierOptions,
  hasBookedSeats = false,
  onChangeSeats,
  onChangeTier,
  onRemove,
}: Props) => {
  const color = getTierColor(tierIndex);

  return (
    <div
      className={`flex items-center gap-3 border rounded-xl p-3 transition-all group ${
        hasBookedSeats
          ? "bg-red-500/5 border-red-500/20"
          : "bg-white/3 border-white/8 hover:border-white/15"
      }`}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg"
        style={{
          backgroundColor: color.bg,
          boxShadow: `0 4px 12px ${color.bg}30`,
        }}
      >
        {row.label}
      </div>

      <div className="flex-1 flex items-center gap-3 flex-wrap">
        <select
          value={String(row.tierId)}
          onChange={(event) => onChangeTier(event.target.value)}
          disabled={hasBookedSeats}
          title={
            hasBookedSeats
              ? "Dãy này đã có ghế được đặt nên không thể đổi hạng vé"
              : "Chọn hạng vé"
          }
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs outline-none focus:border-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {tierOptions.map((tier) => (
            <option key={tier.id} value={tier.id} className="bg-[#1a1a2e]">
              {tier.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-[11px] uppercase font-bold tracking-tighter">
            Số ghế:
          </span>

          <input
            type="number"
            value={row.seats}
            onChange={(event) =>
              onChangeSeats(Math.max(1, Math.min(50, Number(event.target.value))))
            }
            disabled={hasBookedSeats}
            title={
              hasBookedSeats
                ? "Dãy này đã có ghế được đặt nên không thể sửa số ghế"
                : "Sửa số ghế"
            }
            className="w-14 bg-white/5 border border-white/10 rounded-lg px-1 py-1.5 text-white text-xs outline-none text-center font-mono focus:border-orange-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
            min={1}
            max={50}
          />
        </div>

        <span
          className={`text-[10px] px-2 py-0.5 rounded-full ${
            row.disabled.length > 0
              ? "bg-red-500/10 text-red-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {row.disabled.length} ghế khóa
        </span>

        {hasBookedSeats && (
          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
            <Lock className="w-3 h-3" />
            Có ghế đã đặt
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={hasBookedSeats}
        title={
          hasBookedSeats
            ? "Không thể xóa dãy vì đã có ghế được đặt"
            : "Xóa dãy"
        }
        className={`p-2 rounded-lg transition-colors ml-auto ${
          hasBookedSeats
            ? "text-gray-700 cursor-not-allowed opacity-40"
            : "text-gray-600 hover:text-red-400 hover:bg-red-500/10"
        }`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SeatRowEditor;