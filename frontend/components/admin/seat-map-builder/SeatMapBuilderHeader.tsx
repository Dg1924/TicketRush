import { ArrowLeft, CheckCircle, RefreshCw, Save } from "lucide-react";

type Props = {
  title: string;
  saved: boolean;
  onBack: () => void;
  onReset: () => void;
  onSave: () => void;
};

const SeatMapBuilderHeader = ({ title, saved, onBack, onReset, onSave }: Props) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-white text-xl font-bold">Thiết kế sơ đồ ghế</h1>
        <p className="text-orange-500 text-xs font-medium">{title}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-400 rounded-xl px-4 py-2.5 text-xs hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Thiết lập lại
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={saved}
          className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-900/20"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Đã lưu sơ đồ!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Lưu sơ đồ
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SeatMapBuilderHeader;