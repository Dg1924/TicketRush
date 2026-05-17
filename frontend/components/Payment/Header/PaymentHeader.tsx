"use client";

import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const PaymentHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={() => router.back()}>
        <ArrowLeft />
      </button>

      <h1 className="text-white">Thanh toán</h1>

      <div className="ml-auto text-green-400 flex items-center gap-1 text-xs">
        <Shield className="w-3 h-3" />
        SSL Secure
      </div>
    </div>
  );
};

export default PaymentHeader;
