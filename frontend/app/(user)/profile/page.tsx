"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Mail, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "", // Khóa cứng
    gender: "Nam",
    dob: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${apiUrl}/user/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok && result.data) {
          const user = result.data;
          
          // Chuyển đổi định dạng ngày từ DB (ISO) sang YYYY-MM-DD cho thẻ <input type="date">
          let formattedDob = "";
          if (user.dob) {
            formattedDob = new Date(user.dob).toISOString().split("T")[0];
          }

          setFormData({
            name: user.name || "",
            email: user.email || "",
            gender: user.gender || "Nam",
            dob: formattedDob,
          });
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      
      const response = await fetch(`${apiUrl}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          dob: formData.dob,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Lỗi cập nhật");
      
      alert("🎉 Cập nhật hồ sơ thành công!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#08080f] pt-24 text-white text-center flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-orange-500" /></div>;

  return (
    <main className="min-h-screen bg-[#08080f] pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <UserCircle className="w-8 h-8 text-orange-500" />
          Hồ sơ cá nhân
        </h1>

        <form onSubmit={handleUpdate} className="bg-[#12121e] border border-white/10 rounded-2xl p-6 sm:p-8">
          
          {/* TRƯỜNG KHÓA CỨNG: EMAIL */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email đăng nhập (Không thể thay đổi)
            </label>
            <input 
              type="email" 
              value={formData.email} 
              disabled 
              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed opacity-70 select-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Họ và tên</label>
            <input 
              type="text" 
              required
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-[#08080f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Giới tính</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-[#08080f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">Ngày sinh</label>
              <input 
                type="date" 
                required
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                max={new Date().toISOString().split("T")[0]} 
                className="w-full bg-[#08080f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500/50 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/10">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}