import { Trash2 } from "lucide-react";
import type { TicketTier } from "@/data/events";
import { INPUT_CLASS, LABEL_CLASS } from "./AdminEventForm";

type Props = {
  tier: TicketTier;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (key: keyof TicketTier, value: unknown) => void;
};

const TicketTierCard = ({ tier, index, canRemove, onRemove, onChange }: Props) => {
  return (
    <div className="bg-white/3 border border-white/8 rounded-xl p-4 hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider">Hạng vé {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-gray-600 hover:text-red-400 transition-colors p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={LABEL_CLASS}>Tên hạng vé</label>
          <input
            value={tier.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Ví dụ: Vé VIP"
            className={INPUT_CLASS}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className={LABEL_CLASS}>Giá vé (VND)</label>
          <input
            type="number"
            value={tier.price}
            onChange={(e) => onChange("price", Number(e.target.value))}
            placeholder="Giá vé..."
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Tổng số chỗ (Capacity)</label>
          <input
            type="number"
            value={tier.capacity}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChange("capacity", val);
              onChange("available", val); // Khi tạo mới, set luôn available = capacity
            }}
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label className={LABEL_CLASS}>Mô tả quyền lợi</label>
          <input
            value={tier.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Ưu tiên check-in,..."
            className={INPUT_CLASS}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketTierCard;