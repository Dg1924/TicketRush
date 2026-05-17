"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock, MapPin, Zap } from "lucide-react";
import type { Event } from "@/data/events";

// Việt hóa tên danh mục (nếu cần) và giữ màu sắc cũ
const CATEGORY_COLORS: Record<string, string> = {
  concert: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  sports: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  theater: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  festival: "bg-green-500/20 text-green-300 border-green-500/30",
};

// Map danh mục tiếng Anh sang tiếng Việt để hiển thị
const CATEGORY_LABELS: Record<string, string> = {
  concert: "Âm nhạc",
  sports: "Thể thao",
  theater: "Sân khấu",
  comedy: "Hài kịch",
  festival: "Lễ hội",
};

type Props = {
  event: Event;
  index: number;
};

const EventCard = ({ event, index }: Props) => {
  const router = useRouter();

  // 1. Hàm sửa đường dẫn ảnh
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:8000";
  const imageSrc = event.image?.startsWith("/") 
    ? `${apiUrl}${event.image}` 
    : (event.image || "https://placehold.co/600x400?text=No+Image");

  // 2. Hàm format ngày tháng chuẩn Việt Nam
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

  // 3. Tính giá vé an toàn
  // Lấy minPrice từ Backend tính sẵn (nếu có) hoặc tự tính từ tiers
  let minPrice = (event as any).minPrice;
  if (!minPrice && event.tiers && event.tiers.length > 0) {
      minPrice = Math.min(...event.tiers.map((tier) => Number(tier.price)));
  }
  
  const formattedPrice = minPrice && Number(minPrice) > 0 
    ? `${Number(minPrice).toLocaleString('vi-VN')}đ` 
    : "Chưa có vé";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      onClick={() => router.push(`/events/${event.id}`)}
      className="group cursor-pointer bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden hover:border-orange-500/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] transition-all duration-300"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image"; }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#12121e] via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border capitalize ${CATEGORY_COLORS[event.category] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
          >
            {CATEGORY_LABELS[event.category] || event.category}
          </span>
        </div>

        {event.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            Nổi bật
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-orange-400 text-xs mb-1">{event.artist}</p>

        <h3 className="text-white mb-2 line-clamp-1">{event.title}</h3>

        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{formatDate(event.date)}</span>

            <Clock className="w-3 h-3 shrink-0 ml-1" />
            <span>{event.time || "Chưa rõ"}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">
              {event.venue}, {event.city}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-gray-500 text-xs">Từ</span>
            <span className="text-white ml-1 font-medium">{formattedPrice}</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs rounded-full px-3 py-1.5 hover:opacity-90 transition-opacity"
          >
            Mua vé
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;