"use client";

import { useRouter } from "next/navigation";
import { Calendar, Edit2, Loader2, Map, MapPin, Ticket, Trash2 } from "lucide-react";
import EventBadges from "./EventBadges";

type Props = {
  event: any;
  hasSeatMap: boolean;
  onDelete: (eventId: string | number) => void;
  isDeleting?: boolean;
};

const AdminEventCard = ({ event, hasSeatMap, onDelete, isDeleting = false }: Props) => {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:8000";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có ngày";

    try {
      const date = new Date(dateString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      return dateString;
    } catch {
      return dateString;
    }
  };

  const calculateMinPrice = () => {
    if (event.minPrice && Number(event.minPrice) > 0) {
      return Number(event.minPrice);
    }

    if (event.tiers && event.tiers.length > 0) {
      return Math.min(...event.tiers.map((t: any) => Number(t.price)));
    }

    return 0;
  };

  const minPrice = calculateMinPrice();

  const imageSrc = event.image?.startsWith("/")
    ? `${apiUrl}${event.image}`
    : event.image || "https://placehold.co/400?text=No+Image";

  return (
    <div className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-colors group">
      <div className="flex items-center gap-4 p-4">
        <img
          src={imageSrc}
          alt={event.title}
          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/5"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/400?text=No+Image";
          }}
        />

        <div className="flex-1 min-w-0">
          <EventBadges event={event} hasSeatMap={hasSeatMap} />

          <h3 className="text-white font-semibold truncate group-hover:text-orange-400 transition-colors">
            {event.title}
          </h3>

          <p className="text-gray-500 text-sm truncate mb-2">{event.artist}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-gray-500 text-[11px]">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.date)}
            </span>

            <span className="flex items-center gap-1 text-gray-500 text-[11px]">
              <MapPin className="w-3.5 h-3.5" />
              {event.city}
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                <Ticket className="w-3.5 h-3.5" />
                {minPrice > 0
                  ? `Từ ${minPrice.toLocaleString("vi-VN")}đ`
                  : "Chưa có hạng vé"}
              </span>

              <span className="text-[11px] px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300">
                Đã bán {Number(event.soldSeats || 0)} / {Number(event.totalSeats || 0)} ghế
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 ml-4">
          <button
            type="button"
            onClick={() => router.push(`/admin/events/${event.id}/seatmap`)}
            className="flex items-center justify-center gap-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-xl px-4 py-2 text-xs hover:bg-blue-500/20 transition-all"
          >
            <Map className="w-3.5 h-3.5" />
            Sơ đồ ghế
          </button>

          <button
            type="button"
            onClick={() => router.push(`/admin/events/${event.id}/edit`)}
            className="flex items-center justify-center gap-1.5 bg-white/5 text-gray-300 border border-white/10 rounded-xl px-4 py-2 text-xs hover:bg-white/10 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Sửa
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onDelete(event.id)}
            className="flex items-center justify-center gap-1.5 bg-red-500/10 text-red-300 border border-red-500/20 rounded-xl px-4 py-2 text-xs hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isDeleting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;