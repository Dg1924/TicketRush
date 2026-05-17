"use client";

import { useRouter } from "next/navigation";
import { PlusCircle, ListOrdered, ArrowRight } from "lucide-react";

const QuickActions = () => {
  const router = useRouter();

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => router.push("/admin/events/new")}
        className="flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-red-600/10 border border-orange-500/20 rounded-2xl p-5 hover:border-orange-500/40 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <PlusCircle className="w-6 h-6 text-orange-400" />
        </div>

        <div>
          <p className="text-white text-sm font-medium">Tạo sự kiện mới</p>
          <p className="text-gray-500 text-xs">
            Thêm sự kiện và thiết lập sơ đồ ghế
          </p>
        </div>

        <ArrowRight className="w-4 h-4 text-orange-400 ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
      </button>

      <button
        type="button"
        onClick={() => router.push("/admin/events")}
        className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all text-left group"
      >
        <div className="w-12 h-12 rounded-xl bg-white/8 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <ListOrdered className="w-6 h-6 text-gray-400" />
        </div>

        <div>
          <p className="text-white text-sm font-medium">Quản lý sự kiện</p>
          <p className="text-gray-500 text-xs">Chỉnh sửa thông tin và giá vé</p>
        </div>

        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto shrink-0 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default QuickActions;