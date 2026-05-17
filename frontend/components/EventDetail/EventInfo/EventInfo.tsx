import { Calendar, Clock, MapPin } from "lucide-react";

type Event = {
  title: string;
  artist: string;
  date: string;
  time: string;
  city: string;
};

type EventInfoProps = {
  event: Event;
};

const EventInfo = ({ event }: EventInfoProps) => {
  // Hàm format ngày tháng sang chuẩn Việt Nam
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
    <div className="mb-6">
      <h1 className="text-white text-2xl font-bold mb-1">{event.title}</h1>
      <p className="text-orange-400 font-medium">{event.artist}</p>

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="flex flex-col gap-1.5 text-white">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <Calendar size={16} />
            <span>Ngày</span>
          </div>
          <span className="font-medium text-sm">{formatDate(event.date)}</span>
        </div>

        <div className="flex flex-col gap-1.5 text-white">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <Clock size={16} />
            <span>Thời gian</span>
          </div>
          <span className="font-medium text-sm">{event.time || "Chưa rõ"}</span>
        </div>

        <div className="flex flex-col gap-1.5 text-white">
          <div className="flex items-center gap-1.5 text-gray-400 text-sm">
            <MapPin size={16} />
            <span>Địa điểm</span>
          </div>
          <span className="font-medium text-sm line-clamp-1">{event.city}</span>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;