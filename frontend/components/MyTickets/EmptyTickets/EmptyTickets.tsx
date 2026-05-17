"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Đã đổi về framer-motion ổn định
import { ArrowRight, Ticket } from "lucide-react";

const EmptyTickets = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center max-w-sm mx-auto px-4 py-8 flex flex-col items-center justify-center" // 👈 Thêm mx-auto và flex căn giữa
    >
      {/* Icon vé viền cam hiệu ứng nhẹ */}
      <div className="w-20 h-20 rounded-full bg-orange-500/5 border border-orange-500/20 flex items-center justify-center mb-6 shadow-inner">
        <Ticket className="w-9 h-9 text-orange-500" />
      </div>

      {/* Tiêu đề rõ ràng */}
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
        Bạn chưa mua vé nào
      </h2>

      {/* Đoạn mô tả chia dòng hợp lý */}
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        Đăng nhập để xem danh sách vé đã mua, hoặc khám phá những sự kiện bùng nổ sắp diễn ra ngay hôm nay!
      </p>

      {/* Căn chỉnh lại Bo góc các nút đồng bộ bo góc 12px (rounded-xl) giống Admin */}
      <div className="flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl py-3 text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/10"
        >
          Đăng nhập / Đăng ký
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl py-3 text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Khám phá Sự kiện
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default EmptyTickets;