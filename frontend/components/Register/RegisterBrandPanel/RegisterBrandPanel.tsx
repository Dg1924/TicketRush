import { Ticket } from "lucide-react";

const RegisterBrandPanel = () => {
  return (
    <section className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-orange-900/15 to-[#06060f]" />
      <div className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle at 40% 60%, rgba(249,115,22,0.12) 0%, transparent 55%)" }} />
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full border border-orange-500/10 animate-[spin_25s_linear_infinite]" />
      <div className="absolute bottom-32 right-10 w-64 h-64 rounded-full border border-purple-500/10 animate-[spin_20s_linear_infinite_reverse]" />

      <div className="relative z-10 flex flex-col justify-center px-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white text-xl font-black">
            Ticket<span className="text-orange-500">Rush</span>
          </span>
        </div>

        <h2 className="text-white text-3xl mb-4 leading-tight">
          Tham gia cùng<br />hàng triệu fan
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Đăng ký để nhận thông báo sớm về các sự kiện hot, ưu đãi độc quyền và nhiều hơn nữa.
        </p>

        <div className="flex flex-col gap-3">
          {[
            { icon: "🎫", text: "Đặt vé nhanh trong 60 giây" },
            { icon: "🪑", text: "Sơ đồ ghế tương tác" },
            { icon: "📱", text: "Vé QR trên điện thoại" },
            { icon: "🔔", text: "Nhận thông báo sự kiện mới" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-300 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RegisterBrandPanel;
