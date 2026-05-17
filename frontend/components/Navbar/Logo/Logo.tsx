import { Ticket } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
        <Ticket className="text-white w-4 h-4" />
      </div>
      <span className="text-white font-bold">
        Ticket<span className="text-orange-500">Rush</span>
      </span>
    </Link>
  );
};

export default Logo;
