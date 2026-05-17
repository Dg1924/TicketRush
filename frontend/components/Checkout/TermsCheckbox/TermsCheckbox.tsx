import { Check } from "lucide-react";

type Props = {
  agreed: boolean;
  onChange: (value: boolean) => void;
};

const TermsCheckbox = ({ agreed, onChange }: Props) => {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!agreed)}
        className={`w-5 h-5 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-colors ${agreed
            ? "bg-orange-500 border-orange-500"
            : "border-gray-600 bg-transparent"
          }`}
      >
        {agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      <span className="text-gray-400 text-xs leading-relaxed">
        I agree to the{" "}
        <span className="text-orange-400">Terms of Service</span> and{" "}
        <span className="text-orange-400">Refund Policy</span>. All sales are
        final.
      </span>
    </label>
  );
};

export default TermsCheckbox;
