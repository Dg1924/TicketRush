"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";

const CheckoutHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div>
        <h1 className="text-white">Checkout</h1>
        <p className="text-gray-400 text-xs">
          Secure payment powered by TicketRush
        </p>
      </div>

      <Lock className="w-4 h-4 text-green-400 ml-auto" />
    </div>
  );
};

export default CheckoutHeader;
