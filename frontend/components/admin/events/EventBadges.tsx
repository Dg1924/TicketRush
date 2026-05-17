import type { Event } from "@/data/events";

const CATEGORY_COLORS: Record<string, string> = {
  concert: "bg-purple-500/20 text-purple-300",
  sports: "bg-blue-500/20 text-blue-300",
  theater: "bg-pink-500/20 text-pink-300",
  comedy: "bg-yellow-500/20 text-yellow-300",
  festival: "bg-green-500/20 text-green-300",
};

type Props = {
  event: Event;
  hasSeatMap: boolean;
};

const EventBadges = ({ event, hasSeatMap }: Props) => {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span
        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
          CATEGORY_COLORS[event.category] || "bg-gray-500/20 text-gray-300"
        }`}
      >
        {event.category}
      </span>

      {event.featured && (
        <span className="text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md border border-orange-500/20">
          Nổi bật
        </span>
      )}

      <span
        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${
          hasSeatMap
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-gray-800 text-gray-500 border-white/5"
        }`}
      >
        {hasSeatMap ? "Đã có sơ đồ" : "Chưa có sơ đồ"}
      </span>
    </div>
  );
};

export default EventBadges;