"use client";

import { useState, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import type { Event } from "@/data/events";
import { CATEGORIES, INPUT_CLASS, LABEL_CLASS } from "./AdminEventForm";

// Import thư viện lịch và Tiếng Việt
import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";

// Đăng ký ngôn ngữ Tiếng Việt cho bộ lịch
registerLocale("vi", vi);

type Props = {
  form: Omit<Event, "id">;
  tagsInput: string;
  onChange: (key: keyof Omit<Event, "id">, value: unknown) => void;
  onTagsChange: (value: string) => void;
  setImageFile: (file: File | null) => void;
};

const EventBasicInfoForm = ({
  form,
  tagsInput,
  onChange,
  onTagsChange,
  setImageFile,
}: Props) => {
  const [preview, setPreview] = useState<string>(form.image || "");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview("");
    onChange("image", "");
  };

  // Hàm chuyển chuỗi giờ (VD: "20:00") thành Object Date cho DatePicker
  const getParsedTime = () => {
    if (!form.time) return null;
    const [h, m] = form.time.split(":");
    if (!h || !m) return null;
    const d = new Date();
    d.setHours(Number(h), Number(m), 0, 0);
    return d;
  };

  return (
    <section className="bg-[#12121e] border border-white/8 rounded-2xl p-5">
      <h3 className="text-white mb-4 font-medium">Thông tin cơ bản (Basic Information)</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2">
          <label className={LABEL_CLASS}>Tên sự kiện (Title) *</label>
          <input
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="VD: Concert Mùa Thu 2026"
            className={INPUT_CLASS}
          />
        </div>

        {/* Artist */}
        <div>
          <label className={LABEL_CLASS}>Nghệ sĩ / Người biểu diễn *</label>
          <input
            value={form.artist}
            onChange={(e) => onChange("artist", e.target.value)}
            placeholder="VD: Sơn Tùng M-TP"
            className={INPUT_CLASS}
          />
        </div>

        {/* Category */}
        <div>
          <label className={LABEL_CLASS}>Thể loại (Category) *</label>
          <select
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className={INPUT_CLASS}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category} className="bg-[#1a1a2e]">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Date - ĐÃ NÂNG CẤP LÊN REACT-DATEPICKER */}
        <div className="relative z-50">
          <label className={LABEL_CLASS}>Ngày sự kiện (Date) *</label>
          <DatePicker
            selected={form.date ? new Date(form.date) : null}
            onChange={(date: Date | null) => {
              if (date) {
                // Ép chuẩn format YYYY-MM-DD gửi xuống Backend
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const d = String(date.getDate()).padStart(2, "0");
                onChange("date", `${y}-${m}-${d}`);
              } else {
                onChange("date", "");
              }
            }}
            locale="vi"
            dateFormat="dd/MM/yyyy"
            placeholderText="Chọn ngày..."
            className={INPUT_CLASS}
            wrapperClassName="w-full" // Quan trọng để ô input full-width
          />
        </div>

        {/* Time - ĐÃ NÂNG CẤP LÊN REACT-DATEPICKER */}
        <div className="relative z-50">
          <label className={LABEL_CLASS}>Thời gian (Time)</label>
          <DatePicker
            selected={getParsedTime()}
            onChange={(time: Date | null) => {
              if (time) {
                // Ép chuẩn format HH:mm gửi xuống Backend
                const h = String(time.getHours()).padStart(2, "0");
                const m = String(time.getMinutes()).padStart(2, "0");
                onChange("time", `${h}:${m}`);
              } else {
                onChange("time", "");
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Giờ"
            dateFormat="HH:mm"
            placeholderText="Chọn giờ..."
            className={INPUT_CLASS}
            wrapperClassName="w-full"
          />
        </div>

        {/* Venue */}
        <div>
          <label className={LABEL_CLASS}>Địa điểm tổ chức (Venue) *</label>
          <input
            value={form.venue}
            onChange={(e) => onChange("venue", e.target.value)}
            placeholder="VD: Sân vận động Mỹ Đình"
            className={INPUT_CLASS}
          />
        </div>

        {/* City */}
        <div>
          <label className={LABEL_CLASS}>Thành phố (City) *</label>
          <input
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="VD: Hà Nội"
            className={INPUT_CLASS}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div className="sm:col-span-2">
          <label className={LABEL_CLASS}>Ảnh bìa sự kiện (Banner Image) *</label>
          
          {!preview ? (
            <div className="relative border-2 border-dashed border-white/10 rounded-xl hover:border-orange-500/50 transition-colors group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="p-8 flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-gray-500 group-hover:text-orange-500 transition-colors" />
                <p className="text-gray-400 text-sm">Nhấn hoặc kéo thả ảnh vào đây</p>
                <p className="text-gray-600 text-xs">Khuyên dùng: 1200 x 600px</p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <img
                src={preview.startsWith("blob:") ? preview : `http://localhost:8000${preview}`}
                alt="preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className={LABEL_CLASS}>Mô tả sự kiện (Description)</label>
          <textarea
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Nhập thông tin giới thiệu về sự kiện..."
            rows={3}
            className={`${INPUT_CLASS} resize-none`}
          />
        </div>

        {/* Tags */}
        <div className="sm:col-span-2">
          <label className={LABEL_CLASS}>Từ khóa (Tags - cách nhau bằng dấu phẩy)</label>
          <input
            value={tagsInput}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="VD: Nhạc Pop, EDM, Sôi động"
            className={INPUT_CLASS}
          />
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 mt-4 mb-2">
          <button
            type="button"
            onClick={() => onChange("featured", !form.featured)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              form.featured ? 'bg-orange-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                form.featured ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span 
            className="text-sm font-medium text-white cursor-pointer select-none" 
            onClick={() => onChange("featured", !form.featured)}
          >
            Đánh dấu là Sự kiện Nổi bật
          </span>
        </div>
      </div>
    </section>
  );
};

export default EventBasicInfoForm;