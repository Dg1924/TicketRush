"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo/Logo";
import SearchBar from "./SearchBar/SearchBar";
import DesktopNav from "./DesktopNav/DesktopNav";
import MobileMenu from "./MobileMenu/MobileMenu";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  
  // Kiểm tra token mỗi khi component mount hoặc khi chuyển trang (pathname thay đổi)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); // Chuyển đổi sang boolean: có token -> true, không -> false
    };

    checkAuth();
    
    // Lắng nghe thêm sự kiện thay đổi storage trong trường hợp người dùng 
    // đăng nhập/đăng xuất từ một tab khác trên trình duyệt
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false); // Đóng menu mobile nếu đang mở
    router.push("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080f]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <SearchBar />
          
          {/* Truyền trạng thái và hàm đăng xuất xuống DesktopNav */}
          <DesktopNav isLoggedIn={isLoggedIn} onLogout={handleLogout} />

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Truyền trạng thái và hàm đăng xuất xuống MobileMenu */}
        <MobileMenu 
          open={menuOpen} 
          setOpen={setMenuOpen} 
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Navbar;