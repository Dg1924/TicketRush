"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type MobileMenuProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
};

// Đã nhận đủ 4 props ở đây
const MobileMenu = ({ open, setOpen, isLoggedIn, onLogout }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden overflow-hidden flex flex-col gap-4 px-4 py-5 bg-[#0f0f17] border-b border-white/10"
        >
          {/* Menu chung */}
          <Link 
            href="/" 
            onClick={() => setOpen(false)}
            className="text-white hover:text-orange-400 transition-colors font-medium"
          >
            Trang chủ
          </Link>

          {/* Logic rẽ nhánh theo trạng thái đăng nhập */}
          {isLoggedIn ? (
            <>
              {/* 👇 NÚT HỒ SƠ CÁ NHÂN VỪA ĐƯỢC CHÈN THÊM 👇 */}
              <Link 
                href="/profile" 
                onClick={() => setOpen(false)}
                className="text-white hover:text-orange-400 transition-colors font-medium"
              >
                Hồ sơ cá nhân
              </Link>

              <Link 
                href="/my-tickets" 
                onClick={() => setOpen(false)}
                className="text-white hover:text-orange-400 transition-colors font-medium"
              >
                Vé của tôi
              </Link>
              
              <div className="pt-4 border-t border-gray-800 mt-2">
                <button
                  onClick={() => {
                    onLogout(); 
                    setOpen(false);
                  }}
                  className="w-full text-center text-white bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-800 mt-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="w-full text-center text-white border border-gray-700 hover:border-gray-500 px-4 py-3 rounded-lg transition-colors font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="w-full text-center text-white bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-lg transition-colors font-medium"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;