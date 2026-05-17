"use client";

import { memo, useMemo } from "react";
import { Plus } from "lucide-react";
import type { TicketTier } from "@/data/events";
import type { SeatRowConfig } from "@/store/AppContext";
import SeatRowEditor from "./SeatRowEditor";

type Props = {
  rows: SeatRowConfig[];
  tiers: TicketTier[];
  tierIndexMap: Record<string, number>;
  rowHasBookedSeats?: (label: string) => boolean;
  onAddRow: () => void;
  onRemoveRow: (label: string) => void;
  onUpdateRow: (label: string, patch: Partial<SeatRowConfig>) => void;
};

const RowConfiguration = ({
  rows,
  tiers,
  tierIndexMap,
  rowHasBookedSeats,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
}: Props) => {
  const tierOptions = useMemo(
    () =>
      tiers.map((tier) => ({
        id: String(tier.id),
        name: tier.name,
      })),
    [tiers]
  );

  const canAddRow = rows.length < 26;

  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-3.5 bg-white/2 border-b border-white/8">
        <h3 className="text-white text-sm font-medium flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-500 rounded-full" />
          Cấu hình dãy ghế
        </h3>

        <button
          type="button"
          onClick={onAddRow}
          disabled={!canAddRow}
          className="flex items-center gap-1.5 text-orange-400 text-xs hover:text-orange-300 disabled:text-gray-600 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Thêm dãy
        </button>
      </div>

      <div className="p-3 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {rows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xs mb-3 italic">
              Chưa có dãy ghế nào được cấu hình.
            </p>

            <button
              type="button"
              onClick={onAddRow}
              className="px-4 py-2 bg-orange-500/10 text-orange-400 text-xs rounded-lg hover:bg-orange-500 hover:text-white transition-all"
            >
              + Thêm dãy ghế đầu tiên
            </button>
          </div>
        ) : (
          rows.map((row) => {
            const tierIndex = tierIndexMap[String(row.tierId)] ?? 0;
            const hasBookedSeats = rowHasBookedSeats
              ? rowHasBookedSeats(row.label)
              : false;

            return (
              <SeatRowEditor
                key={row.id}
                row={row}
                tierIndex={tierIndex}
                tierOptions={tierOptions}
                hasBookedSeats={hasBookedSeats}
                onChangeSeats={(seats) =>
                  onUpdateRow(row.label, {
                    seats,
                    disabled: row.disabled.filter((seat) => seat <= seats),
                  })
                }
                onChangeTier={(tierId) =>
                  onUpdateRow(row.label, { tierId: String(tierId) })
                }
                onRemove={() => onRemoveRow(row.label)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default memo(RowConfiguration);