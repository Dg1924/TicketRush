"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Event } from "@/data/events"; 
import HomeHeader from "./HomeHeader/HomeHeader";
import FeaturedEvents from "./FeaturedEvents/FeaturedEvents";
import CategoryFilter from "./CategoryFilter/CategoryFilter";
import EventList from "./EventList/EventList";

const Home = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const response = await fetch(`${apiUrl}/user/events`);

        if (!response.ok) {
          throw new Error("Không thể tải danh sách sự kiện");
        }

        const data = await response.json();
        
        // 👇 SỬ DỤNG TRỰC TIẾP DỮ LIỆU TỪ BACKEND 👇
        // Nếu API trả về mảng trực tiếp hoặc nằm trong data.data
        const rawEvents = data.data || data; 
        
        // Cập nhật state luôn, không cần format ảo nữa
        setEvents(rawEvents);
        // 👆 ========================================= 👆

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const featuredEvents = events.filter((event) => event.featured);

  const filteredEvents = useMemo(() => {
    let list = events; 

    if (activeCategory !== "all") {
      list = list.filter((event) => event.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();

      list = list.filter(
        (event) =>
          (event.title && event.title.toLowerCase().includes(q)) ||
          (event.artist && event.artist.toLowerCase().includes(q)) ||
          (event.venue && event.venue.toLowerCase().includes(q)) ||
          (event.city && event.city.toLowerCase().includes(q)) ||
          (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [activeCategory, searchQuery, events]); 

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#08080f] pt-16 flex justify-center items-center">
        <div className="text-white">Đang tải dữ liệu sự kiện...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#08080f] pt-16 flex justify-center items-center">
        <div className="text-red-500">Lỗi: {error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080f] pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!searchQuery && (
          <>
            <HomeHeader />
            {featuredEvents.length > 0 && (
              <FeaturedEvents
                events={featuredEvents}
                activeIndex={featuredIndex}
                onChange={setFeaturedIndex}
              />
            )}
          </>
        )}

        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-white">
              Kết quả tìm kiếm cho{" "}
              <span className="text-orange-400">
                {`"${searchQuery}"`}
              </span>
            </h2>
            <p className="text-gray-400 text-sm">
              Tìm thấy {filteredEvents.length} sự kiện
            </p>
          </div>
        )}

        <CategoryFilter
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <EventList events={filteredEvents} />
      </div>
    </main>
  );
};

export default Home;