import { CheckCircle, Save, Loader2 } from "lucide-react";

type Props = {
  saved: boolean;
  isValid: boolean;
  isEditing: boolean;
  isSaving?: boolean;
  onSave: () => void;
};

const SaveEventButton = ({ saved, isValid, isEditing, isSaving, onSave }: Props) => {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={!isValid || saved || isSaving}
      className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 font-bold transition-all ${
        saved
          ? "bg-green-600 text-white"
          : isValid && !isSaving
            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-orange-900/20"
            : "bg-white/5 text-gray-500 cursor-not-allowed"
      }`}
    >
      {isSaving ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang lưu dữ liệu...
        </>
      ) : saved ? (
        <>
          <CheckCircle className="w-5 h-5" />
          Thành công! Đang chuyển trang...
        </>
      ) : (
        <>
          <Save className="w-5 h-5" />
          {isEditing ? "Lưu thay đổi" : "Phát hành sự kiện"}
        </>
      )}
    </button>
  );
};

export default SaveEventButton;
