"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, UsersRound } from "lucide-react";
import { getSocket } from "@/lib/socket";
import { useApp } from "@/store/AppContext";

type Props = {
  id: string;
};

type QueueState = {
  status: "none" | "waiting" | "active";
  position: number | null;
  activeCount: number;
  waitingCount: number;
  accessToken?: string;
  expiresAt?: number;
};

const WaitingRoom = ({ id }: Props) => {
  const router = useRouter();
  const { sessionId } = useApp();

  const [state, setState] = useState<QueueState>({
    status: "none",
    position: null,
    activeCount: 0,
    waitingCount: 0,
  });

  useEffect(() => {
    if (!id || !sessionId) return;

    const socket = getSocket();

    const token = localStorage.getItem("token");
    let userId: string | null = null;

    try {
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = String(payload.id || "");
      }
    } catch {
      userId = null;
    }

    socket.emit("queue:join", {
      eventId: id,
      sessionId,
      userId,
    });

    const handleQueueUpdate = (payload: QueueState & { eventId: string }) => {
      if (String(payload.eventId) !== String(id)) return;

      setState({
        status: payload.status,
        position: payload.position,
        activeCount: payload.activeCount,
        waitingCount: payload.waitingCount,
        accessToken: payload.accessToken,
        expiresAt: payload.expiresAt,
      });
    };

    const handleAdmitted = (payload: {
      eventId: string;
      accessToken: string;
      expiresAt: number;
    }) => {
      if (String(payload.eventId) !== String(id)) return;

      sessionStorage.setItem(`queue_access_${id}`, payload.accessToken);
      sessionStorage.setItem(`queue_access_expires_${id}`, String(payload.expiresAt));

      router.replace(`/events/${id}/seats`);
    };

    socket.on("queue:update", handleQueueUpdate);
    socket.on("queue:admitted", handleAdmitted);

    return () => {
      socket.off("queue:update", handleQueueUpdate);
      socket.off("queue:admitted", handleAdmitted);
    };
  }, [id, sessionId, router]);

  return (
    <main className="min-h-screen bg-[#08080f] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-[#12121e] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
            {state.status === "active" ? (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            ) : (
              <UsersRound className="w-8 h-8 text-orange-400" />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-3">
          Phòng chờ đặt vé
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Lưu lượng truy cập đang cao. Hệ thống sẽ lần lượt cho người dùng vào chọn ghế.
          Vui lòng không tải lại trang.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center mb-6">
          {state.status === "active" ? (
            <>
              <p className="text-emerald-400 text-sm mb-2">
                Bạn đã được cấp quyền truy cập
              </p>
              <p className="text-gray-400 text-sm">
                Đang chuyển vào màn hình chọn ghế...
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-2">
                Vị trí của bạn trong hàng đợi
              </p>
              <p className="text-5xl font-black text-orange-400">
                {state.position ?? "..."}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs mb-1">Đang được vào</p>
            <p className="text-xl font-bold text-emerald-400">
              {state.activeCount}/3
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs mb-1">Đang chờ</p>
            <p className="text-xl font-bold text-orange-400">
              {state.waitingCount}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Đang giữ kết nối với phòng chờ...
        </div>
      </div>
    </main>
  );
};

export default WaitingRoom;