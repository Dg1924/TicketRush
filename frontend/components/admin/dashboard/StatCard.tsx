import type { ComponentType } from "react";
import { TrendingUp } from "lucide-react";

type Props = {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  color: string;
};

const StatCard = ({ icon: Icon, label, value, sub, color }: Props) => {
  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>

        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>

      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white text-2xl">{value}</p>

      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
};

export default StatCard;
