"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserCircle, LogOut, Home, Ticket, ChevronDown } from "lucide-react";

interface DesktopNavProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const DesktopNav = ({ isLoggedIn, onLogout }: DesktopNavProps) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // State để điều khiển việc đóng/mở Menu xổ xuống
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (isLoggedIn) {
      const savedName = localStorage.getItem("userName");
      setUserName(savedName);
    }
  }, [isLoggedIn]);

  // Logic tự động đóng menu khi người dùng click ra ngoài khoảng trống
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Không render để tránh lỗi Hydration
  if (!mounted) return null;

  return (
    <nav className="hidden md:flex items-center text-sm font-medium text-white z-50">
      
      {/* NẾU CHƯA ĐĂNG NHẬP -> Hiện nút Trang chủ ở ngoài cùng Đăng nhập/Đăng ký */}
      {!isLoggedIn && (
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-orange-400 transition-colors">Trang chủ</Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-orange-400 transition-colors">Đăng nhập</Link>
            <Link href="/register" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
              Đăng ký
            </Link>
          </div>
        </div>
      )}

      {/* NẾU ĐÃ ĐĂNG NHẬP -> Gom tất cả vào Dropdown Menu */}
      {isLoggedIn && (
        <div className="relative" ref={dropdownRef}>
          {/* Nút hiển thị tên người dùng (Bấm vào để mở menu) */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all duration-200"
          >
            <UserCircle className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">
              Chào, <span className="text-white font-semibold">{userName || "Thành viên"}</span>
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Thanh chọn 4 món (Dropdown Panel) */}
          <div 
            className={`absolute right-0 mt-3 w-56 bg-[#12121e] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden transition-all origin-top-right ${
              dropdownOpen ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"
            }`}
          >
            <Link 
              href="/" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
            >
              <Home className="w-4 h-4 text-gray-400" />
              Trang chủ
            </Link>

            <Link 
              href="/profile" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
            >
              <UserCircle className="w-4 h-4 text-orange-400" />
              Thông tin cá nhân
            </Link>

            <Link 
              href="/my-tickets" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
            >
              <Ticket className="w-4 h-4 text-emerald-400" />
              Vé của tôi
            </Link>

            <div className="h-px bg-white/10 my-1"></div>

            <button 
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 text-left font-medium"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DesktopNav;