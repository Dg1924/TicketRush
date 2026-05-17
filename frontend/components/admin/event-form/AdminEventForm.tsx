"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import type { Event, TicketTier } from "@/data/events";
import EventBasicInfoForm from "./EventBasicInfoForm";
import TicketTiersEditor from "./TicketTiersEditor";

type Props = { id?: string };

export const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm outline-none focus:border-orange-500/50 transition-colors";

export const LABEL_CLASS = "block text-gray-400 text-xs mb-1.5";

export const CATEGORIES = ["concert", "sports", "theater", "comedy", "festival"] as const;

export function createNewTier(): TicketTier {
  return {
    id: "t" + Math.random().toString(36).slice(2, 6),
    name: "",
    price: 0,
    available: 100,
    capacity: 100,
    description: "",
  };
}

const safeParseJson = <T,>(value: unknown, fallback: T): T => {
  if (!value) return fallback;
  if (typeof value === "object") return value as T;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return fallback;
};

const getToken = () =>
  localStorage.getItem("token") || localStorage.getItem("tr_admin_token") || "";

const AdminEventForm = ({ id }: Props) => {
  const router = useRouter();
  const isEditMode = Boolean(id && id !== "new");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState("");

  const [form, setForm] = useState<Omit<Event, "id">>({
    title: "",
    artist: "",
    category: "concert",
    date: "",
    time: "",
    venue: "",
    city: "",
    image: "",
    featured: false,
    tags: [],
    description: "",
    tiers: [createNewTier()],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEditMode) return;

      setIsLoading(true);

      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

        const response = await fetch(`${apiUrl}/admin/events/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Không thể lấy dữ liệu sự kiện");
        }

        const event = result.data;
        const parsedTags = safeParseJson<string[]>(event.tags, []);

        setForm({
          title: event.title || "",
          artist: event.artist || "",
          category: event.category || "concert",
          date: event.date || event.event_date || "",
          time: event.time || event.event_time || "",
          venue: event.venue || "",
          city: event.city || "",
          image: event.image || "",
          featured: Boolean(event.featured),
          tags: parsedTags,
          description: event.description || "",
          tiers:
  event.tiers?.length
    ? event.tiers.map((tier: any) => {
        const rows =
          event.seat_map_config?.rows?.filter(
            (row: any) => String(row.tierId) === String(tier.id)
          ) || [];

        const calculatedCapacity = rows.reduce(
          (sum: number, row: any) =>
            sum + (row.seats - (row.disabled?.length || 0)),
          0
        );

        return {
          ...tier,
          capacity: calculatedCapacity || tier.capacity,
          available: calculatedCapacity || tier.available,
        };
      })
    : [createNewTier()],
        });

        setTagsInput(parsedTags.join(", "));
      } catch (error) {
        console.error("Lỗi lấy dữ liệu sự kiện:", error);
        alert(error instanceof Error ? error.message : "Không thể lấy dữ liệu sự kiện");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, isEditMode]);

  const setField = (key: keyof typeof form, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setTier = (index: number, key: keyof TicketTier, value: unknown) => {
    setForm((prev) => {
      const tiers = [...prev.tiers];
      tiers[index] = { ...tiers[index], [key]: value };
      return { ...prev, tiers };
    });
  };

  const addTier = () => {
    setForm((prev) => ({ ...prev, tiers: [...prev.tiers, createNewTier()] }));
  };

  const removeTier = (index: number) => {
    setForm((prev) => ({
      ...prev,
      tiers: prev.tiers.filter((_, idx) => idx !== index),
    }));
  };

  const isValid =
    Boolean(form.title.trim()) &&
    Boolean(form.artist.trim()) &&
    Boolean(form.date) &&
    Boolean(form.venue.trim());

  const handleSave = async () => {
    if (!isValid || isSaving) return;

    setIsSaving(true);

    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("artist", form.artist.trim());
    formData.append("category", form.category);
    formData.append("date", String(form.date).split("T")[0]);
    formData.append("time", String(form.time || "00:00:00").slice(0, 8));
    formData.append("venue", form.venue.trim());
    formData.append("city", form.city || "");
    formData.append("description", form.description || "");
    formData.append("featured", String(form.featured));
    formData.append(
      "tags",
      JSON.stringify(tagsInput.split(",").map((t) => t.trim()).filter(Boolean))
    );
    formData.append(
      "tiers",
      JSON.stringify(
        form.tiers
          .filter((tier) => String(tier.name || "").trim())
          .map((tier) => ({
            id: tier.id,
            name: String(tier.name || "").trim(),
            price: Number(tier.price || 0),
            capacity: Number(tier.capacity || tier.available || 0),
            available: Number(tier.available || tier.capacity || 0),
            description: tier.description || "",
          }))
      )
    );

    if (imageFile) formData.append("image", imageFile);
    else if (form.image) formData.append("image", form.image);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

      const response = await fetch(
        isEditMode ? `${apiUrl}/admin/events/${id}` : `${apiUrl}/admin/events`,
        {
          method: isEditMode ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi lưu sự kiện");
      }

      setSaved(true);
      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      console.error("Lỗi lưu sự kiện:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi lưu sự kiện");
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h1 className="text-white text-xl font-bold">
          {isEditMode ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
        </h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
        <EventBasicInfoForm
          form={form}
          tagsInput={tagsInput}
          onChange={setField}
          onTagsChange={setTagsInput}
          setImageFile={setImageFile}
        />

        <TicketTiersEditor
          tiers={form.tiers}
          onAddTier={addTier}
          onRemoveTier={removeTier}
          onChangeTier={setTier}
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={!isValid || isSaving || saved}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-xl"
        >
          {isSaving ? <Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> : <Save className="w-4 h-4 inline mr-2" />}
          {saved ? "Đã lưu" : "Lưu sự kiện"}
        </button>
      </motion.div>
    </div>
  );
};

export default AdminEventForm;