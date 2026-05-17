"use client";

import { useRouter } from "next/navigation";
import { Download, Home, Share2 } from "lucide-react";
import { motion } from "motion/react";

const ConfirmationActions = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="flex flex-col gap-3"
    >
      <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full py-3 hover:opacity-90 transition-opacity">
        <Download className="w-4 h-4" />
        Download Tickets (PDF)
      </button>

      <button className="w-full flex items-center justify-center gap-2 bg-white/8 border border-white/10 text-white rounded-full py-3 hover:bg-white/12 transition-colors">
        <Share2 className="w-4 h-4" />
        Share with Friends
      </button>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-3 transition-colors text-sm"
      >
        <Home className="w-4 h-4" />
        Back to Events
      </button>
    </motion.div>
  );
};

export default ConfirmationActions;
