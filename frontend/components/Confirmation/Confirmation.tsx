"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { EVENTS } from "@/data/events";
import SuccessBadge from "./SuccessBadge/SuccessBadge";
import TicketCard from "./TicketCard/TicketCard";
import OrderSummary from "./OrderSummary/OrderSummary";
import ConfirmationActions from "./ConfirmationActions/ConfirmationActions";

const Confirmation = () => {
  const fired = useRef(false);

  const event = EVENTS[0];
  const tier = event.tiers[0];
  const quantity = 1;
  const total = tier.price + 8;
  const seatIds: string[] = [];
  const orderId = "TR-DEMO01";
  const buyerName = "Demo User";
  const buyerEmail = "demo@example.com";

  useEffect(() => {
    if (fired.current) return;

    fired.current = true;

    const end = Date.now() + 2500;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#f97316", "#ef4444", "#fb923c"],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#f97316", "#ef4444", "#fb923c"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <main className="min-h-screen bg-[#08080f] pt-16 pb-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <SuccessBadge buyerEmail={buyerEmail} />

        <TicketCard
          event={event}
          tier={tier}
          quantity={quantity}
          seatIds={seatIds}
          orderId={orderId}
          buyerName={buyerName}
        />

        <OrderSummary orderId={orderId} total={total} />

        <ConfirmationActions />
      </div>
    </main>
  );
};

export default Confirmation;
