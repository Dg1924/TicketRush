"use client";

import { motion } from "motion/react";
import { Ticket } from "lucide-react";

type Props = {
  buyerEmail?: string;
};

const SuccessBadge = ({ buyerEmail }: Props) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center mb-8"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)] mb-4">
        <Ticket className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-white text-center mb-2">You&apos;re In! 🎉</h1>

      <p className="text-gray-400 text-sm text-center">
        Your tickets are confirmed.
        {buyerEmail ? ` Sent to ${buyerEmail}.` : ""}
      </p>
    </motion.div>
  );
};

export default SuccessBadge;
