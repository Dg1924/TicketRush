"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { SeatMapConfig, SeatRowConfig } from "@/store/AppContext";
import { generateDefaultSeatMap } from "@/data/seatMapGenerator";

import SeatMapBuilderHeader from "./SeatMapBuilderHeader";
import SeatMapStats from "./SeatMapStats";
import StageNameInput from "./StageNameInput";
import RowConfiguration from "./RowConfiguration";
import SeatMapPreview from "./SeatMapPreview";
import SeatMapHelp from "./SeatMapHelp";
import { Loader2 } from "lucide-react";

const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const DEFAULT_SEATS_PER_ROW = 20;

type Props = {
  id: string;
};

type BookedSeat = {
  id: string | number;
  seat: string;
  status: "pending" | "paid" | "locked" | string;
  createdAt?: string;
  buyerName?: string;
  buyerEmail?: string;
  tierName?: string;
  price?: number | string;
};

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("tr_admin_token") ||
    ""
  );
};

const normalizeSeatMap = (
  seatMapData: SeatMapConfig | null,
  eventId: string | number
): SeatMapConfig | null => {
  if (!seatMapData) return null;

  return {
    ...seatMapData,
    eventId: (seatMapData as any).eventId || eventId,
    rows: Array.isArray(seatMapData.rows) ? seatMapData.rows : [],
  } as SeatMapConfig;
};

const AdminSeatMapBuilder = ({ id }: Props) => {
  const router = useRouter();

  const [event, setLocalEvent] = useState<any>(null);
  const [config, setConfig] = useState<SeatMapConfig | null>(null);
  const [bookedSeats, setBookedSeats] = useState<BookedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab] = useState<"rows" | "preview">("preview");

  useEffect(() => {
    const fetchEventAndSeatMap = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const token = getToken();

        const eventRes = await fetch(`${apiUrl}/admin/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const eventResult = await eventRes.json();

        if (!eventRes.ok) {
          throw new Error(eventResult.message || "Không lấy được sự kiện");
        }

        const currentEvent = eventResult.data;
        setLocalEvent(currentEvent);

        const seatmapRes = await fetch(`${apiUrl}/admin/events/${id}/seatmap`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const seatmapResult = await seatmapRes.json();

        if (seatmapRes.ok && seatmapResult.data) {
          const seatMapData =
            seatmapResult.data.seat_map_config || seatmapResult.data;

          const normalizedConfig =
            normalizeSeatMap(seatMapData, currentEvent.id) ||
            normalizeSeatMap(generateDefaultSeatMap(currentEvent), currentEvent.id);

          setConfig(normalizedConfig);
          setBookedSeats(seatmapResult.data.bookedSeats || []);
        } else {
          setConfig(
            normalizeSeatMap(generateDefaultSeatMap(currentEvent), currentEvent.id)
          );
          setBookedSeats([]);
        }
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
        alert(err instanceof Error ? err.message : "Lỗi tải sơ đồ ghế");
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndSeatMap();
  }, [id]);

  const tierIndexMap = useMemo(() => {
    const map: Record<string, number> = {};

    event?.tiers?.forEach((tier: any, index: number) => {
      map[String(tier.id)] = index;
    });

    return map;
  }, [event]);

  const seatMapEventId = useMemo(() => {
    return String((config as any)?.eventId || event?.id || id || "");
  }, [config, event, id]);

  const getBookedSeatsInRow = useCallback(
    (rowLabel: string) => {
      return bookedSeats.filter((ticket) => {
        const seat = String(ticket.seat || "");
        return seat.startsWith(`${seatMapEventId}_${rowLabel}_`);
      });
    },
    [bookedSeats, seatMapEventId]
  );

  const rowHasBookedSeats = useCallback(
    (rowLabel: string) => {
      return getBookedSeatsInRow(rowLabel).length > 0;
    },
    [getBookedSeatsInRow]
  );

  const totalSeats = useMemo(() => {
    return (
      config?.rows.reduce(
        (sum, row) => sum + Number(row.seats || 0) - row.disabled.length,
        0
      ) || 0
    );
  }, [config?.rows]);

  const disabledSeats = useMemo(() => {
    return config?.rows.reduce((sum, row) => sum + row.disabled.length, 0) || 0;
  }, [config?.rows]);

  const handleBack = useCallback(() => {
    router.push("/admin/events");
  }, [router]);

  const handleStageNameChange = useCallback((stageName: string) => {
    setConfig((prev) => (prev ? { ...prev, stageName } : null));
  }, []);

  const addRow = useCallback(() => {
    if (!event || !config || !event.tiers?.length) return;

    setConfig((prev) => {
      if (!prev) return null;

      const usedLabels = new Set(prev.rows.map((row) => row.label));
      const nextLabel = LABELS.find((label) => !usedLabels.has(label));

      if (!nextLabel) {
        alert("Đã đạt số dãy ghế tối đa.");
        return prev;
      }

      const newRow: SeatRowConfig = {
        id: `row-${nextLabel}-${Date.now()}`,
        label: nextLabel,
        seats: DEFAULT_SEATS_PER_ROW,
        tierId: String(event.tiers[0].id),
        disabled: [],
      };

      return {
        ...prev,
        rows: [...prev.rows, newRow].sort((a, b) =>
          a.label.localeCompare(b.label)
        ),
      };
    });
  }, [event, config]);

  const removeRow = useCallback(
    (label: string) => {
      const bookedInRow = getBookedSeatsInRow(label);

      if (bookedInRow.length > 0) {
        const seatList = bookedInRow
          .map((ticket) => ticket.seat)
          .slice(0, 8)
          .join(", ");

        alert(
          `Không thể xóa dãy ${label} vì dãy này đã có ${bookedInRow.length} ghế được đặt.\n\n` +
            `Ghế liên quan: ${seatList}${bookedInRow.length > 8 ? ", ..." : ""}`
        );

        return;
      }

      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa dãy ${label} không?`
      );

      if (!confirmed) return;

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              rows: prev.rows.filter((row) => row.label !== label),
            }
          : null
      );
    },
    [getBookedSeatsInRow]
  );

  const updateRow = useCallback(
    (label: string, patch: Partial<SeatRowConfig>) => {
      if (rowHasBookedSeats(label)) {
        const blockedKeys = Object.keys(patch).filter((key) =>
          ["tierId", "seats"].includes(key)
        );

        if (blockedKeys.length > 0) {
          alert(
            `Không thể sửa hạng vé hoặc số ghế của dãy ${label} vì dãy này đã có ghế được đặt.`
          );
          return;
        }
      }

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              rows: prev.rows.map((row) =>
                row.label === label ? { ...row, ...patch } : row
              ),
            }
          : null
      );
    },
    [rowHasBookedSeats]
  );

  const toggleSeat = useCallback(
    (rowLabel: string, seatNumber: number) => {
      const seatId = `${seatMapEventId}_${rowLabel}_${seatNumber}`;
      const isBooked = bookedSeats.some(
        (ticket) => String(ticket.seat) === seatId
      );

      if (isBooked) {
        alert("Ghế này đã được đặt hoặc đang giữ, không thể khóa/mở khóa.");
        return;
      }

      setConfig((prev) =>
        prev
          ? {
              ...prev,
              rows: prev.rows.map((row) => {
                if (row.label !== rowLabel) return row;

                const disabled = row.disabled.includes(seatNumber)
                  ? row.disabled.filter((item) => item !== seatNumber)
                  : [...row.disabled, seatNumber];

                return { ...row, disabled };
              }),
            }
          : null
      );
    },
    [bookedSeats, seatMapEventId]
  );

  const handleReset = useCallback(() => {
    if (!event) return;

    const confirmed = window.confirm(
      "Thiết lập lại sơ đồ có thể làm mất cấu hình hiện tại. Bạn có chắc không?"
    );

    if (!confirmed) return;

    const nextConfig = normalizeSeatMap(generateDefaultSeatMap(event), event.id);

    if (!nextConfig) return;

    const rowsWithBookedSeats = nextConfig.rows.filter((row) =>
      rowHasBookedSeats(row.label)
    );

    if (rowsWithBookedSeats.length > 0) {
      alert(
        "Không thể thiết lập lại sơ đồ vì sự kiện đã có ghế được đặt. Hãy chỉnh từng phần để tránh mất dữ liệu vé."
      );
      return;
    }

    setConfig(nextConfig);
  }, [event, rowHasBookedSeats]);

  const validateBeforeSave = useCallback(() => {
    if (!config) return false;

    for (const ticket of bookedSeats) {
      const seat = String(ticket.seat || "");
      const parts = seat.split("_");

      if (parts.length < 3) continue;

      const rowLabel = parts[1];
      const seatNumber = Number(parts[2]);
      const row = config.rows.find((item) => item.label === rowLabel);

      if (!row) {
        alert(
          `Không thể lưu vì ghế ${seat} đã được đặt nhưng dãy ${rowLabel} không còn tồn tại.`
        );
        return false;
      }

      if (Number(row.seats || 0) < seatNumber) {
        alert(
          `Không thể lưu vì ghế ${seat} đã được đặt nhưng dãy ${rowLabel} chỉ còn ${row.seats} ghế.`
        );
        return false;
      }

      if (row.disabled.includes(seatNumber)) {
        alert(`Không thể lưu vì ghế ${seat} đã được đặt nhưng đang bị khóa.`);
        return false;
      }
    }

    return true;
  }, [config, bookedSeats]);

  const handleSave = async () => {
    if (!event || !config) {
      alert("Không có dữ liệu sơ đồ ghế để lưu.");
      return;
    }

    if (!validateBeforeSave()) return;

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const token = getToken();

      const configToSave = {
        ...config,
        eventId: (config as any).eventId || event.id || id,
      };

      const response = await fetch(`${apiUrl}/admin/events/${id}/seatmap`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(configToSave),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi lưu sơ đồ ghế");
      }

      setConfig(normalizeSeatMap(result.data || configToSave, event.id));
      setSaved(true);

      alert(result.message || "Lưu sơ đồ ghế thành công!");
    } catch (err) {
      console.error("Lỗi lưu sơ đồ ghế:", err);
      alert(err instanceof Error ? err.message : "Lỗi khi lưu sơ đồ ghế");
    }
  };

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center text-gray-500">
        <Loader2 className="animate-spin mb-2" />
        Đang tải cấu hình ghế...
      </div>
    );
  }

  if (!event || !config) {
    return (
      <div className="p-6 text-center text-gray-400">
        Không tìm thấy sự kiện.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SeatMapBuilderHeader
        title={event.title}
        saved={saved}
        onBack={handleBack}
        onReset={handleReset}
        onSave={handleSave}
      />

      <SeatMapStats
        config={config}
        tiers={event.tiers}
        tierIndexMap={tierIndexMap}
        totalSeats={totalSeats}
        disabledSeats={disabledSeats}
      />

      <StageNameInput
        value={config.stageName}
        onChange={handleStageNameChange}
      />

      <div className="grid lg:grid-cols-5 gap-4 mt-6">
        <div
          className={`lg:col-span-2 ${
            activeTab === "rows" ? "block" : "hidden lg:block"
          }`}
        >
          <RowConfiguration
            rows={config.rows}
            tiers={event.tiers}
            tierIndexMap={tierIndexMap}
            rowHasBookedSeats={rowHasBookedSeats}
            onAddRow={addRow}
            onRemoveRow={removeRow}
            onUpdateRow={updateRow}
          />
        </div>

        <div
          className={`lg:col-span-3 ${
            activeTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <SeatMapPreview
            config={config}
            tierIndexMap={tierIndexMap}
            editMode={editMode}
            bookedSeats={bookedSeats}
            onToggleSeat={toggleSeat}
            onToggleEditMode={() => setEditMode(!editMode)}
          />
        </div>
      </div>

      <SeatMapHelp />
    </div>
  );
};

export default AdminSeatMapBuilder;