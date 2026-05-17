"use client";

import { useEffect, useState } from "react";
import EventListHeader from "./EventListHeader";
import AdminEventCard from "./AdminEventCard";
import { Loader2 } from "lucide-react";

const getToken = () => {
  return localStorage.getItem("token") || localStorage.getItem("tr_admin_token") || "";
};

const AdminEventsList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const fetchEvents = async () => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const response = await fetch(`${apiUrl}/admin/events`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể tải danh sách sự kiện");
      }

      setEvents(data.data?.events || data.data || []);
    } catch (err) {
      console.error("Lỗi fetch events:", err);
      alert(err instanceof Error ? err.message : "Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string | number) => {
    const event = events.find((item) => String(item.id) === String(eventId));

    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa sự kiện "${event?.title || eventId}" không?\n\nHành động này không thể hoàn tác.`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(eventId);

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const response = await fetch(`${apiUrl}/admin/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể xóa sự kiện");
      }

      setEvents((prev) => prev.filter((item) => String(item.id) !== String(eventId)));
      alert(result.message || "Xóa sự kiện thành công!");
    } catch (err) {
      console.error("Lỗi xóa sự kiện:", err);
      alert(err instanceof Error ? err.message : "Không thể xóa sự kiện");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-gray-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <p>Đang tải danh sách sự kiện.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <EventListHeader total={events.length} />

      <div className="grid gap-4 mt-4">
        {events.length === 0 ? (
          <div className="text-center py-20 bg-[#12121e] rounded-2xl border border-dashed border-white/10">
            <p className="text-gray-500">Chưa có sự kiện nào được tạo.</p>
          </div>
        ) : (
          events.map((event, index) => (
            <AdminEventCard
              key={event.id ?? index}
              event={event}
              hasSeatMap={Boolean(event.hasConfig || event.seat_map_config)}
              onDelete={handleDeleteEvent}
              isDeleting={String(deletingId) === String(event.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEventsList;