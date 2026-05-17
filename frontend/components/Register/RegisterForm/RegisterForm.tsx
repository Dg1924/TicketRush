"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, AlertCircle, Check, Calendar } from "lucide-react";
import PasswordStrength from "../PasswordStrength/PasswordStrength";
import SuccessState from "../SuccessState/SuccessState";

const INPUT =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all";

// 1. Thêm gender và dob vào type
type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  gender: string;
  dob: string;
};

const RegisterForm = () => {
  const router = useRouter();

  // 2. Khởi tạo giá trị mặc định cho giới tính và ngày sinh
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    gender: "Nam", // Mặc định là Nam
    dob: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (!form.dob) {
      setError("Vui lòng chọn ngày sinh.");
      return;
    }

    if (!agreed) {
      setError("Vui lòng đồng ý với điều khoản sử dụng.");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      
      // Gọi API đăng ký
      const response = await fetch(`${apiUrl}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: form.name, 
          email: form.email, 
          password: form.password,
          passwordConfirm: form.confirm,
          gender: form.gender, // 👈 Truyền giới tính
          dob: form.dob        // 👈 Truyền ngày sinh
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email này có thể đã tồn tại. Vui lòng thử lại.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);

    } catch (err: any) {
      setError(err.message || "Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  if (success) return <SuccessState />;

  return (
    <>
      <h2 className="text-white mb-1 text-2xl font-semibold">Tạo tài khoản</h2>
      <p className="text-gray-400 text-sm mb-6">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-orange-400 hover:text-orange-300 transition-colors">
          Đăng nhập ngay
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Họ và tên</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="Nguyễn Văn A"
              className={`${INPUT} pl-11`}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="email@example.com"
              className={`${INPUT} pl-11`}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Giới tính</label>
            <div className="flex gap-2">
              {["Nam", "Nữ", "Khác"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, gender: g }))}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    form.gender === g
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-gray-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Ngày sinh</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 z-10" />
              <input
                type="date"
                value={form.dob}
                onChange={set("dob")}
                required
                max={new Date().toISOString().split("T")[0]}
                className={`${INPUT} pl-11 [color-scheme:dark] relative`}
              />
            </div>
          </div>
          
        </div>

        {/* Phone */}
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Số điện thoại</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="0912 345 678"
              className={`${INPUT} pl-11`}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              placeholder="Tối thiểu 8 ký tự"
              className={`${INPUT} pl-11 pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.password && <PasswordStrength password={form.password} />}
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-gray-400 text-xs mb-1.5 block">Xác nhận mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="••••••••"
              className={`${INPUT} pl-11 pr-12`}
              required
            />
            {form.confirm && form.password === form.confirm && (
              <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer">
          <button
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`w-5 h-5 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
              agreed ? "bg-orange-500 border-orange-500" : "border-gray-600"
            }`}
          >
            {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </button>
          <span className="text-gray-400 text-xs leading-relaxed">
            Tôi đồng ý với{" "}
            <span className="text-orange-400">Điều khoản dịch vụ</span>{" "}
            và{" "}
            <span className="text-orange-400">Chính sách bảo mật</span>{" "}
            của TicketRush
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl py-3.5 hover:opacity-90 transition-opacity shadow-[0_6px_20px_rgba(249,115,22,0.3)] disabled:opacity-60 mt-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Tạo tài khoản <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </>
  );
};
export default RegisterForm;