"use client";

import { motion } from "motion/react";

type Props = {
  orderId: string;
  total: number;
};

const OrderSummary = ({ orderId, total }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#12121e] border border-white/8 rounded-2xl p-4 mb-6"
    >
      <h3 className="text-white mb-3 text-sm">Order Summary</h3>

      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-400">Order ID</span>
        <span className="text-gray-300 font-mono">{orderId}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Total Paid</span>
        <span className="text-orange-400">${total}</span>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
