import { Ticket } from "lucide-react";

const BENEFITS = [
  "✓ Chọn ghế tương tác trực quan",
  "✓ Thanh toán VNPay, ZaloPay, MoMo",
  "✓ Nhận vé QR tức thì",
  "✓ Quản lý vé dễ dàng",
];

const LoginBrandPanel = () => {
  return (
    <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/30 via-red-900/20 to-[#06060f]" />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, rgba(249,115,22,0.15) 0%, transparent 60%)",
        }}
      />

      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-orange-500/10 animate-[spin_20s_linear_infinite]" />
      <div className="absolute top-1/3 left-1/3 w-40 h-40 rounded-full border border-orange-500/15 animate-[spin_15s_linear_infinite_reverse]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border border-orange-500/8" />

      <div className="relative z-10 flex flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            <Ticket className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>

          <span className="text-white text-2xl font-black tracking-tight">
            Ticket<span className="text-orange-500">Rush</span>
          </span>
        </div>

        <h2 className="text-white text-4xl mb-4 leading-tight">
          Trải nghiệm
          <br />
          sự kiện đỉnh cao
        </h2>

        <p className="text-gray-400 leading-relaxed mb-8">
          Đặt vé nhanh chóng, chọn ghế thoải mái, thanh toán an toàn với mọi
          phương thức phổ biến tại Việt Nam.
        </p>

        <div className="flex flex-col gap-3">
          {BENEFITS.map((benefit) => (
            <p key={benefit} className="text-gray-300 text-sm">
              {benefit}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoginBrandPanel;
