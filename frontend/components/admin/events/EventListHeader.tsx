"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

type Props = {
  total: number;
};

const EventListHeader = ({ total }: Props) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-white mb-1">Events</h1>
        <p className="text-gray-400 text-sm">{total} events total</p>
      </div>

      <button
        type="button"
        onClick={() => router.push("/admin/events/new")}
        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full px-4 py-2 text-sm hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        New Event
      </button>
    </div>
  );
};

export default EventListHeader;
