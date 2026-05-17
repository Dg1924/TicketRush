"use client";

import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

const HomeHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-orange-500" />
        <span className="text-orange-500 text-sm">Đang Thịnh Hành</span>
      </div>

      <h1 className="text-white mb-2">
        Đừng Bỏ Lỡ Các{" "}
        <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Sự Kiện Trực Tiếp
        </span>
      </h1>

      <p className="text-gray-400 text-sm">
        Khám phá các buổi hòa nhạc, thể thao, sân khấu và nhiều sự kiện khác quanh bạn.
      </p>
    </motion.div>
  );
};

export default HomeHeader;
