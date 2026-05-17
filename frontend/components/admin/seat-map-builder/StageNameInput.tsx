type Props = {
  value: string;
  onChange: (value: string) => void;
};

const StageNameInput = ({ value, onChange }: Props) => {
  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl p-4 mb-4 flex items-center gap-4 shadow-sm">
      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest shrink-0">Tên sân khấu:</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-orange-500/50 w-full max-w-xs transition-all font-medium"
        placeholder="Vd: MAIN STAGE"
      />
    </div>
  );
};

export default StageNameInput;