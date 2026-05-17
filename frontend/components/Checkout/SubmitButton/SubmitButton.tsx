import { ChevronRight } from "lucide-react";

type Props = {
  isValid: boolean;
  loading: boolean;
};

const SubmitButton = ({ isValid, loading }: Props) => {
  return (
    <button
      type="submit"
      disabled={!isValid || loading}
      className={`w-full flex items-center justify-center gap-2 rounded-full py-4 transition-all ${isValid && !loading
          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 shadow-[0_8px_30px_rgba(249,115,22,0.3)]"
          : "bg-white/10 text-gray-500 cursor-not-allowed"
        }`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Đang xử lý...
        </>
      ) : (
        <>
          Tiếp tục chọn phương thức thanh toán
          <ChevronRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
};

export default SubmitButton;
