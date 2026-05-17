"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { EVENTS as DEFAULT_EVENTS, type Event } from "../data/events";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface SeatRowConfig {
  id: string;
  label: string;
  seats: number;
  tierId: string;
  disabled: number[]; // 1-based seat numbers
}

export interface SeatMapConfig {
  eventId: string;
  stageName: string;
  rows: SeatRowConfig[];
}

export interface SeatHold {
  status: "held" | "sold";
  heldUntil?: number;
  sessionId?: string;
}

export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  tierName: string;
  seatIds: string[];
  quantity: number;
  total: number;
  buyerName: string;
  buyerEmail: string;
  createdAt: number;
}

interface AppContextType {
  // Auth
  user: AppUser | null;
  login: (email: string, password: string) => boolean;
  register: (data: Omit<AppUser, "id"> & { password: string }) => boolean;
  logout: () => void;

  events: Event[];
  addEvent: (e: Event) => void;
  updateEvent: (id: string, patch: Partial<Event>) => void;
  seatMaps: Record<string, SeatMapConfig>;
  saveSeatMap: (eventId: string, config: SeatMapConfig) => void;
seatStatuses: Record<string, SeatHold>;
holdSeats: (seatIds: string[]) => void;
releaseSeat: (seatId: string) => void;
releaseSeats: (seatIds: string[]) => void;
confirmSeats: (seatIds: string[]) => void;
setSeatHeld: (
  seatId: string,
  data: {
    sessionId: string;
    heldUntil: number;
  }
) => void;
setSeatReleased: (seatId: string) => void;
setSeatSold: (seatId: string) => void;
orders: Order[];
  addOrder: (o: Order) => void;
  sessionId: string;
}

// ─── Session ID ───────────────────────────────────────────────────────────────

function getSessionId() {
  if (typeof window === "undefined") return "server_sess";
  let id = sessionStorage.getItem("tr_session");
  if (!id) {
    id = "sess_" + Math.random().toString(36).slice(2);
    sessionStorage.setItem("tr_session", id);
  }
  return id;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const sessionId = getSessionId();

  // Auth state
  const [user, setUser] = useState<AppUser | null>(() => load("tr_user", null));
  const [registeredUsers, setRegisteredUsers] = useState<
    Array<AppUser & { password: string }>
  >(() => load("tr_registered", []));

  const [events, setEvents] = useState<Event[]>(() =>
    load("tr_events", DEFAULT_EVENTS)
  );
  const [seatMaps, setSeatMaps] = useState<Record<string, SeatMapConfig>>(() =>
    load("tr_seatmaps", {})
  );
  const [seatStatuses, setSeatStatuses] = useState<Record<string, SeatHold>>(
    () => load("tr_seats", {})
  );
  const [orders, setOrders] = useState<Order[]>(() => load("tr_orders", []));

  // Persist
  useEffect(() => { localStorage.setItem("tr_user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("tr_registered", JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem("tr_events", JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem("tr_seatmaps", JSON.stringify(seatMaps)); }, [seatMaps]);
  useEffect(() => { localStorage.setItem("tr_seats", JSON.stringify(seatStatuses)); }, [seatStatuses]);
  useEffect(() => { localStorage.setItem("tr_orders", JSON.stringify(orders)); }, [orders]);

  // Auto-release expired holds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSeatStatuses((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.entries(next).forEach(([id, v]) => {
          if (v.status === "held" && v.heldUntil && v.heldUntil < now) {
            delete next[id];
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ── Auth methods ────────────────────────────────────────────────────────────
  const login = (email: string, password: string): boolean => {
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _p, ...u } = found;
      setUser(u);
      return true;
    }
    return false;
  };

  const register = (data: Omit<AppUser, "id"> & { password: string }): boolean => {
    if (registeredUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return false;
    }
    const newUser = { id: "user-" + Math.random().toString(36).slice(2), ...data };
    setRegisteredUsers((p) => [...p, newUser]);
    const { password: _p, ...u } = newUser;
    setUser(u);
    return true;
  };

  const logout = () => setUser(null);

  const addEvent = (e: Event) => setEvents((p) => [e, ...p]);
  const updateEvent = (id: string, patch: Partial<Event>) =>
    setEvents((p) => p.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  const saveSeatMap = (eventId: string, config: SeatMapConfig) =>
    setSeatMaps((p) => ({ ...p, [eventId]: config }));

  const holdSeats = (seatIds: string[]) => {
    const heldUntil = Date.now() + 10 * 60 * 1000;
    setSeatStatuses((prev) => {
      const next = { ...prev };
      seatIds.forEach((id) => {
        next[id] = { status: "held", heldUntil, sessionId };
      });
      return next;
    });
  };

  const releaseSeat = (seatId: string) =>
    setSeatStatuses((p) => { const n = { ...p }; delete n[seatId]; return n; });

  const releaseSeats = (seatIds: string[]) =>
    setSeatStatuses((p) => { const n = { ...p }; seatIds.forEach((id) => delete n[id]); return n; });

const confirmSeats = (seatIds: string[]) =>
  setSeatStatuses((p) => {
    const n = { ...p };
    seatIds.forEach((id) => {
      n[id] = { status: "sold", sessionId };
    });
    return n;
  });

const setSeatHeld = (
  seatId: string,
  data: {
    sessionId: string;
    heldUntil: number;
  }
) => {
  setSeatStatuses((prev) => ({
    ...prev,
    [seatId]: {
      status: "held",
      sessionId: data.sessionId,
      heldUntil: data.heldUntil,
    },
  }));
};

const setSeatReleased = (seatId: string) => {
  setSeatStatuses((prev) => {
    const next = { ...prev };
    delete next[seatId];
    return next;
  });
};

const setSeatSold = (seatId: string) => {
  setSeatStatuses((prev) => ({
    ...prev,
    [seatId]: {
      status: "sold",
    },
  }));
};

const addOrder = (o: Order) => setOrders((p) => [o, ...p]);

  return (
    <AppContext.Provider
      value={{
        user, login, register, logout,
        events, addEvent, updateEvent,
	seatMaps, saveSeatMap,
seatStatuses,
holdSeats,
releaseSeat,
releaseSeats,
confirmSeats,
setSeatHeld,
setSeatReleased,
setSeatSold,
orders, addOrder,
sessionId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
