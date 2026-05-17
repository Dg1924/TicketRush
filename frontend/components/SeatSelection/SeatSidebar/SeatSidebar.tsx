"use client";

import { AlertCircle, ChevronRight, Clock } from "lucide-react";
import type { Event } from "@/data/events";
import type { SeatMapConfig } from "@/store/AppContext";
import SelectedSeatsList from "../SelectedSeatsList/SelectedSeatsList";

type Props = {
  event: Event;
  config: SeatMapConfig;
  displaySeats: string[];
  heldSeatIds: string[];
  selectedSeats: string[];
  subtotal: number;
  fee: number;
  onRemoveSeat: (seatId: string) => void;
  onHoldSeats: () => void;
  onCheckout: () => void;
};

const SeatSidebar = ({
  event,
  config,
  displaySeats,
  heldSeatIds,
  selectedSeats,
  subtotal,
  fee,
  onRemoveSeat,
  onHoldSeats,
  onCheckout,
}: Props) => {
  const hasHeldSeats = heldSeatIds.length > 0;

  return (
    <aside className="lg:w-72 flex flex-col gap-4">
      <div className="bg-[#12121e] border border-white/8 rounded-2xl p-4">
        <h3 className="text-white mb-3">
          {hasHeldSeats ? "Ghế đang giữ" : "Ghế đã chọn"}
        </h3>

        {displaySeats.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-5 h-5 text-gray-600" />
            </div>

            <p className="text-gray-500 text-xs">
              Bấm vào sơ đồ để chọn ghế
            </p>
          </div>
        ) : (
          <SelectedSeatsList
            event={event}
            config={config}
            seats={displaySeats}
            heldMode={hasHeldSeats}
            onRemoveSeat={onRemoveSeat}
          />
        )}

        {displaySeats.length > 0 && (
          <div className="border-t border-white/8 pt-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Tạm tính</span>
              <span className="text-gray-300">{Number(subtotal).toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Phí dịch vụ</span>
              <span className="text-gray-300">{Number(fee).toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="flex justify-between border-t border-white/8 pt-2 mt-1">
              <span className="text-white font-medium">Tổng cộng</span>
              <span className="text-orange-400 font-bold">{Number(subtotal + fee).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        )}
      </div>

      {hasHeldSeats ? (
        <button
          type="button"
          onClick={onCheckout}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl py-3.5 hover:opacity-90 transition-opacity shadow-[0_8px_24px_rgba(249,115,22,0.3)] font-medium"
        >
          <Clock className="w-4 h-4" />
          Tiến hành thanh toán
          <ChevronRight className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onHoldSeats}
          disabled={selectedSeats.length === 0}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 transition-all font-medium ${selectedSeats.length > 0
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 shadow-[0_8px_24px_rgba(249,115,22,0.3)]"
              : "bg-white/8 text-gray-500 cursor-not-allowed"
            }`}
        >
          Giữ {selectedSeats.length > 0 ? `${selectedSeats.length} ghế` : "ghế"}
          {selectedSeats.length > 0 && " (10 phút)"}
        </button>
      )}

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3">
        <p className="text-blue-300 text-xs leading-relaxed">
          <strong>Cách thức hoạt động:</strong> Chọn ghế của bạn, bấm{" "}
          <span className="font-semibold">&quot;Giữ ghế&quot;</span> để giữ chỗ
          trong 10 phút, sau đó hoàn tất thanh toán.
        </p>
      </div>
    </aside>
  );
};

export default SeatSidebar;