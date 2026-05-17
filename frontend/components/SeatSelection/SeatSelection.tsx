"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/store/AppContext";
import { generateDefaultSeatMap } from "@/data/seatMapGenerator";
import type { SeatMapConfig } from "@/store/AppContext";
import SeatHeader from "./SeatHeader/SeatHeader";
import HoldTimerBanner from "./HoldTimerBanner/HoldTimerBanner";
import SeatLegend from "./SeatLegend/SeatLegend";
import SeatMap from "./SeatMap/SeatMap";
import SeatSidebar from "./SeatSidebar/SeatSidebar";
import { getSocket } from "@/lib/socket";

type Props = {
  id: string;
};

const useCountdown = (expiresAt: number | null) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!expiresAt) {
      setRemaining(0);
      return;
    }

    const tick = () => {
      setRemaining(Math.max(0, expiresAt - Date.now()));
    };

    tick();

    const timer = setInterval(tick, 500);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return { remaining, mins, secs };
};

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
};

const SeatSelection = ({ id }: Props) => {
  const router = useRouter();

  const {
    seatMaps,
    seatStatuses,
    holdSeats,
    releaseSeats,
    sessionId,
    setSeatHeld,
    setSeatReleased,
    setSeatSold,
  } = useApp();

  const [queueChecked, setQueueChecked] = useState(false);

  const [event, setEvent] = useState<any>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [heldSeatIds, setHeldSeatIds] = useState<string[]>([]);
  const [holdExpiresAt, setHoldExpiresAt] = useState<number | null>(null);

  const { remaining, mins, secs } = useCountdown(holdExpiresAt);

  useEffect(() => {
    if (!id) return;

    const accessToken = sessionStorage.getItem(`queue_access_${id}`);
    const expiresAt = Number(
      sessionStorage.getItem(`queue_access_expires_${id}`) || 0
    );

    if (!accessToken || !expiresAt || expiresAt <= Date.now()) {
      router.replace(`/events/${id}/queue`);
      return;
    }

    setQueueChecked(true);
  }, [id, router]);

  useEffect(() => {
  if (!id || !queueChecked) return;

  const socket = getSocket();

  const leaveQueue = () => {
    socket.emit("queue:leave", {
      eventId: id,
      sessionId,
    });
  };

  window.addEventListener("beforeunload", leaveQueue);
  window.addEventListener("pagehide", leaveQueue);

  return () => {
    window.removeEventListener("beforeunload", leaveQueue);
    window.removeEventListener("pagehide", leaveQueue);

    // Không gọi leaveQueue() ở đây.
    // React Strict Mode trong dev có thể chạy cleanup thử,
    // nếu gọi leaveQueue ở đây thì slot queue bị nhả sai.
  };
}, [id, queueChecked, sessionId]);

  useEffect(() => {
    if (!id || !queueChecked) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/user/events/${id}`);

        if (!response.ok) {
          throw new Error("Không thể tải thông tin sự kiện");
        }

        const data = await response.json();
        setEvent(data.data?.event || data.data || data);
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin sự kiện");
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [id, queueChecked]);

  useEffect(() => {
    if (!id || !queueChecked) return;

    const socket = getSocket();

    socket.emit("event:join", id);

    const handleSeatUpdate = (payload: any) => {
      if (String(payload.eventId) !== String(id)) return;

      if (payload.type === "held") {
        payload.seats?.forEach((seatId: string) => {
          setSeatHeld(seatId, {
            sessionId: payload.sessionId,
            heldUntil: payload.heldUntil,
          });
        });
      }

      if (payload.type === "released") {
        payload.seats?.forEach((seatId: string) => {
          setSeatReleased(seatId);
        });
      }

      if (payload.type === "sold") {
        payload.seats?.forEach((seatId: string) => {
          setSeatSold(seatId);
        });
      }
    };

    socket.on("seat:update", handleSeatUpdate);

    return () => {
      socket.off("seat:update", handleSeatUpdate);
      socket.emit("event:leave", id);
    };
  }, [id, queueChecked, setSeatHeld, setSeatReleased, setSeatSold]);

  const config: SeatMapConfig | null = useMemo(() => {
    if (!event) return null;

    let parsedConfig: SeatMapConfig | null = null;

    if (event.seat_map_config) {
      try {
        parsedConfig =
          typeof event.seat_map_config === "string"
            ? JSON.parse(event.seat_map_config)
            : event.seat_map_config;
      } catch (err) {
        console.error("Lỗi parse cấu hình ghế từ DB:", err);
      }
    }

    return parsedConfig ?? seatMaps[id] ?? generateDefaultSeatMap(event);
  }, [event, seatMaps, id]);

  useEffect(() => {
    if (!event) return;

    const myHeld: string[] = [];
    let expiry = 0;

    Object.entries(seatStatuses).forEach(([seatId, hold]) => {
      if (
        seatId.startsWith(`${id}_`) &&
        hold.status === "held" &&
        hold.sessionId === sessionId
      ) {
        myHeld.push(seatId);
        expiry = Math.max(expiry, hold.heldUntil ?? 0);
      }
    });

    queueMicrotask(() => {
      setHeldSeatIds(myHeld);
      setHoldExpiresAt(myHeld.length > 0 ? expiry : null);
    });
  }, [id, event, seatStatuses, sessionId]);

  const getSeatTier = useCallback(
    (seatId: string) => {
      if (!event || !config) return event?.tiers?.[0];

      const [, rowLabel] = seatId.split("_");

      const row = config.rows.find(
        (item) => String(item.label) === String(rowLabel)
      );

      if (!row) return event.tiers?.[0];

      return (
        event.tiers?.find(
          (tier: any) =>
            String(tier.id) === String(row.tierId) ||
            String(tier._id) === String(row.tierId)
        ) ?? event.tiers?.[0]
      );
    },
    [event, config]
  );

  const handleReleaseHold = useCallback(async () => {
    if (heldSeatIds.length === 0) {
      setSelectedSeats([]);
      setHoldExpiresAt(null);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await fetch(`${getApiUrl()}/user/release-seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          eventId: event?.id || event?._id || id,
          seats: heldSeatIds,
          sessionId,
        }),
      });
    } catch (err) {
      console.error("Lỗi hủy giữ ghế:", err);
    }

    releaseSeats(heldSeatIds);
    setHeldSeatIds([]);
    setHoldExpiresAt(null);
    setSelectedSeats([]);
  }, [event, id, heldSeatIds, sessionId, releaseSeats]);

  useEffect(() => {
    if (
      heldSeatIds.length > 0 &&
      holdExpiresAt !== null &&
      remaining === 0 &&
      Date.now() >= holdExpiresAt
    ) {
      handleReleaseHold();
    }
  }, [remaining, heldSeatIds, holdExpiresAt, handleReleaseHold]);

  const handleSeatClick = useCallback((seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : prev.length < 8
        ? [...prev, seatId]
        : prev
    );
  }, []);

  const handleRemoveSeat = (seatId: string) => {
    setSelectedSeats((prev) => prev.filter((seat) => seat !== seatId));
  };

  const handleHoldSeats = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập để giữ ghế.");
      router.push("/login");
      return;
    }

    if (selectedSeats.length === 0 || !event || !config) return;

    try {
      const seatsToHold = selectedSeats.map((seatId) => {
        const tier = getSeatTier(seatId);

        return {
          seatId,
          tierId: tier?.id || tier?._id,
        };
      });

      const response = await fetch(`${getApiUrl()}/user/hold-seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id || event._id || id,
          seats: seatsToHold,
          sessionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể giữ ghế");
      }

      holdSeats(selectedSeats);
      setHeldSeatIds(selectedSeats);
      setHoldExpiresAt(result.data?.heldUntil || Date.now() + 10 * 60 * 1000);
      setSelectedSeats([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể giữ ghế");
    }
  };

  const calcSubtotal = () => {
    const seats = heldSeatIds.length > 0 ? heldSeatIds : selectedSeats;

    return seats.reduce((total, seatId) => {
      const tier = getSeatTier(seatId);
      return total + Number(tier?.price ?? 0);
    }, 0);
  };

  const handleCheckout = () => {
    if (!event || !config || heldSeatIds.length === 0) return;

    const checkoutSeats = heldSeatIds.map((seatId) => {
      const tier = getSeatTier(seatId);

      return {
        seatId,
        tierId: tier?.id || tier?._id,
        tierName: tier?.name || "",
        price: Number(tier?.price || 0),
      };
    });

    localStorage.setItem("tr_checkout_seats", JSON.stringify(checkoutSeats));
    const socket = getSocket();

socket.emit("queue:leave", {
  eventId: id,
  sessionId,
});
    router.push(`/payment?eventId=${event.id || event._id}`);
  };

  if (!queueChecked) {
    return (
      <main className="min-h-screen bg-[#08080f] pt-16 flex items-center justify-center">
        <p className="text-white">Đang kiểm tra quyền truy cập...</p>
      </main>
    );
  }

  if (isLoadingEvent) {
    return (
      <main className="min-h-screen bg-[#08080f] pt-16 flex items-center justify-center">
        <p className="text-white">Đang tải sơ đồ ghế...</p>
      </main>
    );
  }

  if (error || !event || !config) {
    return (
      <main className="min-h-screen bg-[#08080f] pt-16 flex items-center justify-center">
        <p className="text-red-500">
          {error || "Không tìm thấy sự kiện."}
        </p>
      </main>
    );
  }

  const displaySeats = heldSeatIds.length > 0 ? heldSeatIds : selectedSeats;
  const subtotal = calcSubtotal();
  const fee = 0;

  return (
    <main className="min-h-screen bg-[#08080f] pt-16 pb-32">
      <SeatHeader event={event} />

      <AnimatePresence>
        {heldSeatIds.length > 0 && holdExpiresAt && (
          <HoldTimerBanner
            heldCount={heldSeatIds.length}
            mins={mins}
            secs={secs}
            remaining={remaining}
            onRelease={handleReleaseHold}
            onCheckout={handleCheckout}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col lg:flex-row gap-6">
        <section className="flex-1 bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
            <h3 className="text-white">Chọn ghế của bạn</h3>
            <p className="text-gray-400 text-xs">Tối đa 8 ghế mỗi đơn hàng</p>
          </div>

          <SeatLegend tiers={event.tiers} />

          <div className="overflow-x-auto">
            <SeatMap
              config={config}
              tiers={event.tiers}
              seatStatuses={seatStatuses}
              selectedSeats={selectedSeats}
              sessionId={sessionId}
              heldMode={heldSeatIds.length > 0}
              onSeatClick={handleSeatClick}
              bookedSeats={event.bookedSeats || []}
            />
          </div>
        </section>

        <SeatSidebar
          event={event}
          config={config}
          displaySeats={displaySeats}
          heldSeatIds={heldSeatIds}
          selectedSeats={selectedSeats}
          subtotal={subtotal}
          fee={fee}
          onRemoveSeat={handleRemoveSeat}
          onHoldSeats={handleHoldSeats}
          onCheckout={handleCheckout}
        />
      </div>
    </main>
  );
};

export default SeatSelection;