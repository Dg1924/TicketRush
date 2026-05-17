"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import type { Event } from "@/data/events";

// Việt hóa category
const CATEGORY_LABELS: Record<string, string> = {
  concert: "Âm nhạc",
  sports: "Thể thao",
  theater: "Sân khấu",
  comedy: "Hài kịch",
  festival: "Lễ hội",
};

type Props = {
  event: Event;
};

const FeaturedBanner = ({ event }: Props) => {
  const router = useRouter();

  if (!event) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:8000";
  
  // 1. Xử lý ảnh
  const imageSrc = event.image?.startsWith("/") 
    ? `${apiUrl}${event.image}` 
    : (event.image || "https://placehold.co/1200x600?text=No+Image");

  // 2. Format ngày tháng
  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa cập nhật";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit", month: "2-digit", year: "numeric"
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // 3. Tính giá tiền rẻ nhất
  let minPrice = (event as any).minPrice;
  if (!minPrice && event.tiers && event.tiers.length > 0) {
      minPrice = Math.min(...event.tiers.map((tier) => Number(tier.price)));
  }
  const formattedPrice = minPrice && Number(minPrice) > 0 
    ? `${Number(minPrice).toLocaleString('vi-VN')}đ` 
    : "Chưa có vé";

  return (
    <div className="relative h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden group cursor-pointer" onClick={() => router.push(`/events/${event.id}`)}>
      <img
        src={imageSrc}
        alt={event.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x600?text=No+Image"; }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          {event.featured && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              Nổi bật
            </span>
          )}
          <span className="text-gray-300 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {CATEGORY_LABELS[event.category] || event.category}
          </span>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
          {event.title}
        </h2>
        <p className="text-orange-400 font-medium mb-4">{event.artist}</p>

        <div className="flex flex-wrap items-center gap-5 text-gray-300 text-sm mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            {event.venue}, {event.city}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/events/${event.id}`);
            }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:gap-3"
          >
            Mua vé từ {formattedPrice}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;