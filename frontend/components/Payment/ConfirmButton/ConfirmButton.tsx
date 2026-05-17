"use client";

interface ConfirmButtonProps {
  onConfirm: () => void;
  isProcessing: boolean;
}

const ConfirmButton = ({ onConfirm, isProcessing }: ConfirmButtonProps) => {
  return (
    <button
      onClick={onConfirm}
      disabled={isProcessing}
      className={`w-full py-4 mt-6 rounded-xl text-white font-bold text-lg transition-all duration-300 flex justify-center items-center gap-2
        ${
          isProcessing
            ? "bg-gray-600 cursor-not-allowed opacity-70"
            : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98] shadow-lg shadow-orange-500/25"
        }
      `}
    >
      {isProcessing ? (
        <>
          {/* Icon loading xoay xoay */}
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý thanh toán...
        </>
      ) : (
        "Xác nhận thanh toán"
      )}
    </button>
  );
};

export default ConfirmButton;