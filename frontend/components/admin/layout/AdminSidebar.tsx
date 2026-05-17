"use client";

import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  LayoutDashboard,
  List,
  LogOut,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import AdminNavItem from "./AdminNavItem";

const NAV_LINKS = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/events", icon: List, label: "Sự kiện", exact: true },
  { href: "/admin/events/new", icon: CalendarPlus, label: "Tạo Sự Kiện" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Đơn hàng" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

const AdminSidebar = ({ open, onClose }: Props) => {
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
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#0d0d1a] border-r border-white/8 flex flex-col transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>

          <div>
            <p className="text-white text-sm font-black">
              Ticket<span className="text-orange-500">Rush</span>
            </p>
            <p className="text-orange-400 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_LINKS.map((item) => (
          <AdminNavItem key={item.href} {...item} onClick={onClose} />
        ))}
      </nav>

      <div className="p-3 border-t border-white/8">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:text-white hover:bg-red-500/15 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;