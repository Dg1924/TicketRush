"use client";

import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  onMenuClick?: () => void;
};

const AdminTopbar = ({ onMenuClick }: Props) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tr_admin_token");
    localStorage.removeItem("tr_admin_user");
    localStorage.removeItem("tr_user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-20 border-b border-white/8 bg-[#0b0b16]/95 backdrop-blur sticky top-0 z-40 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <div className="px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />

          <span className="text-orange-400 text-sm font-medium">
            Admin Mode
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;