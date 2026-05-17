import { Ticket } from "lucide-react";

const MobileLogo = () => {
  return (
    <div className="flex items-center gap-2 mb-8 lg:hidden">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
        <Ticket className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>

      <span className="text-white text-xl font-black">
        Ticket<span className="text-orange-500">Rush</span>
      </span>
    </div>
  );
};

export default MobileLogo;
