"use client";

import { useRouter } from "next/navigation";

type EventCTAProps = {
  event: {
    id: string | number;
  };
};

const EventCTA = ({ event }: EventCTAProps) => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/events/${event.id}/seats`)}
      className="w-full bg-orange-500 text-white py-4 rounded-full font-semibold hover:bg-orange-600 transition"
      aria-label="Choose seats"
    >
      Choose Seats
    </button>
  );
};

export default EventCTA;
