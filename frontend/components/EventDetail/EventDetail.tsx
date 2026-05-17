"use client";

import { useEffect, useState } from "react";
import EventHero from "./EventHero/EventHero";
import EventInfo from "./EventInfo/EventInfo";
import TicketTiers from "./TicketTiers/TicketTiers";
import EventCTA from "./CTA/CTA";
import EventDescription from "./Description/Description";

const EventDetail = ({ id }: { id: string }) => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Có thêm /api/v1 cho chắc chắn (tùy vào env của bạn)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"; 
        const res = await fetch(`${apiUrl}/user/events/${id}`);
        const data = await res.json();

        // 👇 ĐÃ SỬA: Lấy thẳng data.data thay vì data.data.event
        if (res.ok && data.data) {
          const rawEvent = data.data;
          
          // Xử lý link ảnh để không bị lỗi 404 trong trang chi tiết
          const baseUrl = process.env.NEXT_PUBLIC_API_URL_BASE || "http://localhost:8000";
          const imageSrc = rawEvent.image?.startsWith("/") 
            ? `${baseUrl}${rawEvent.image}` 
            : (rawEvent.image || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop");

          // Chuẩn hóa dữ liệu từ DB cho các component con
          const formattedEvent = {
            ...rawEvent,
            image: imageSrc, // Dùng ảnh đã xử lý
            artist: rawEvent.artist || rawEvent.title,
            // Chống crash cho TicketTiers
            tiers: Array.isArray(rawEvent.tiers) ? rawEvent.tiers : []
          };
          
          setEvent(formattedEvent);
        }
      } catch (err) {
        console.error("Lỗi fetch chi tiết event:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#08080f] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-gray-400">Không tìm thấy sự kiện hoặc ID không hợp lệ.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 text-orange-500 hover:underline"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080f] pb-24">
      {/* liked mặc định là false, onLike có thể bổ sung sau */}
      <EventHero event={event} liked={false} onLike={() => {}} />
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <EventInfo event={event} />
        <EventDescription description={event.description || "Chưa có mô tả chi tiết cho sự kiện này."} />
        <TicketTiers tiers={event.tiers} />
        <EventCTA event={event} />
      </div>
    </main>
  );
};

export default EventDetail;