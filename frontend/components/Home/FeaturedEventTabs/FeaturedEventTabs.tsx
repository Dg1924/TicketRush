"use client";

import type { Event } from "@/data/events";

type Props = {
  events: Event[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const FeaturedEventTabs = ({ events, activeIndex, onChange }: Props) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:8000";

  // Hàm format ngày tháng
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
    <div className="flex flex-col gap-3">
      {events.map((event, index) => {
        const imageSrc = event.image?.startsWith("/") 
          ? `${apiUrl}${event.image}` 
          : (event.image || "https://placehold.co/400x200?text=No+Image");

        return (
          <button
            key={event.id}
            type="button"
            onClick={() => onChange(index)}
            className={`text-left rounded-xl overflow-hidden relative group transition-all duration-200 ${
              index === activeIndex
                ? "ring-2 ring-orange-500"
                : "opacity-60 hover:opacity-80"
            }`}
          >
            <img
              src={imageSrc}
              alt={event.title}
              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=No+Image"; }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-2 left-2 right-2">
              <p className="text-white text-xs line-clamp-1">{event.title}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">{formatDate(event.date)}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FeaturedEventTabs;