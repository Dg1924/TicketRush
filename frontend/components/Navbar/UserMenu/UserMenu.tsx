"use client";

import { useState } from "react";
import { useApp } from "@/store/AppContext";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex gap-2">
        <button onClick={() => router.push("/login")} className="text-gray-300 hover:text-white transition-colors">
          Đăng nhập
        </button>
        <button onClick={() => router.push("/register")} className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_6px_20px_rgba(249,115,22,0.3)]">
          Đăng ký
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        {user.name}
      </button>

      {open && (
        <div>
          <button onClick={() => router.push("/my-tickets")}>
            Vé của tôi
          </button>
          <button onClick={() => logout()}>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
