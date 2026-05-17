"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react";

const INPUT =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all";

type LoginUser = {
  id?: number;
  name?: string;
  email?: string;
  role?: "admin" | "user" | string;
};

const normalizeToken = (rawToken: unknown) => {
  if (!rawToken || typeof rawToken !== "string") return "";

  let token = rawToken.trim();

  while (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim();
  }

  token = token.replace(/^"+|"+$/g, "").trim();

  if (token.split(".").length !== 3) return "";

  return token;
};

const pickUserFromResponse = (data: any): LoginUser => {
  return data?.data?.user || data?.user || data?.data || {};
};

const LoginForm = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveSession = (token: string, user: LoginUser) => {
    const cleanToken = normalizeToken(token);

    if (!cleanToken) {
      throw new Error("Backend trả token không hợp lệ.");
    }

    localStorage.setItem("token", cleanToken);
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userRole", user.role || "user");
    localStorage.setItem("tr_user", JSON.stringify(user));

    if (user.role === "admin") {
      localStorage.setItem("tr_admin_token", cleanToken);
      localStorage.setItem("tr_admin_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tr_admin_token");
      localStorage.removeItem("tr_admin_user");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const response = await fetch(`${apiUrl}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email hoặc mật khẩu không đúng.");
      }

      const token = data.token;
      const user = pickUserFromResponse(data);

      saveSession(token, user);

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message || "Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-gray-400 text-xs mb-1.5 block">Email</label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            placeholder="email@example.com"
            className={`${INPUT} pl-11`}
            required
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-gray-400 text-xs">Mật khẩu</label>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="text-orange-400 text-sm hover:text-orange-300"
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

          <input
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="••••••••"
            className={`${INPUT} pl-11 pr-12`}
            required
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPass ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl py-3.5 hover:opacity-90 transition-opacity shadow-[0_6px_20px_rgba(249,115,22,0.3)] disabled:opacity-60"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Đăng nhập
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;