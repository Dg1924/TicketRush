"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import type { Event } from "@/data/events";

type Props = {
  event: Event;
};

const SeatHeader = ({ event }: Props) => {
  const router = useRouter();

  // Hàm format ngày tháng chuẩn Việt Nam
  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-[#0d0d1a] border-b border-white/8 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(`/events/${event.id}`)} // Đã thêm chữ 's' vào /events/
          className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-orange-400 text-xs">{event.artist}</p>
          <h3 className="text-white truncate">{event.title}</h3>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(event.date)}
          </span>

          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {event.venue}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatHeader;