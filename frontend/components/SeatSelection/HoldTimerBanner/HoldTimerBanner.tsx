"use client";

import { motion } from "framer-motion"; // Đã đổi lại thành framer-motion cho đồng bộ
import { ChevronRight, Clock } from "lucide-react";

type Props = {
  heldCount: number;
  mins: number;
  secs: number;
  remaining: number;
  onRelease: () => void;
  onCheckout: () => void;
};

const HoldTimerBanner = ({
  heldCount,
  mins,
  secs,
  remaining,
  onRelease,
  onCheckout,
}: Props) => {
  const urgent = remaining < 120000; // Dưới 2 phút thì chuyển đỏ

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`overflow-hidden ${urgent
        ? "bg-red-900/40 border-b border-red-500/30"
        : "bg-emerald-900/40 border-b border-emerald-500/30"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock
            className={`w-4 h-4 ${urgent ? "text-red-400" : "text-emerald-400"
              }`}
          />

          <span className="text-white text-sm">
            Đã giữ {heldCount} ghế — {" "}
            <span
              className={`font-mono ${urgent ? "text-red-300" : "text-emerald-300"
                }`}
            >
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>{" "}
            còn lại
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRelease}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded"
          >
            Hủy giữ ghế
          </button>

          <button
            type="button"
            onClick={onCheckout}
            className="flex items-center gap-1 bg-orange-500 text-white text-xs rounded-full px-3 py-1.5 hover:bg-orange-600 transition-colors"
          >
            Thanh toán
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HoldTimerBanner;