"use client";

import { motion } from "motion/react";
import { Calendar, MapPin } from "lucide-react";
import type { Event, TicketTier } from "@/data/events";

type Props = {
  event: Event;
  tier: TicketTier;
  quantity: number;
  total: number;
  seatIds: string[];
};

const OrderSummary = ({ event, tier, quantity, total, seatIds }: Props) => {
  const subtotal = tier.price * quantity;
  const serviceFee = total - subtotal;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="md:col-span-2"
    >
      <div className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden sticky top-20">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-36 object-cover"
        />

        <div className="p-4">
          <p className="text-orange-400 text-xs mb-1">{event.artist}</p>
          <h3 className="text-white mb-3">{event.title}</h3>

          <div className="flex flex-col gap-1.5 mb-4">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <Calendar className="w-3 h-3 text-orange-500 shrink-0" />
              {event.date} at {event.time}
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
              {event.venue}
            </div>
          </div>

          {seatIds.length > 0 && (
            <div className="mb-3">
              <p className="text-gray-500 text-xs mb-1.5">Ghế đã chọn</p>

              <div className="flex flex-wrap gap-1">
                {seatIds.map((seatId) => {
                  const parts = seatId.split("_");

                  return (
                    <span
                      key={seatId}
                      className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded-full"
                    >
                      {parts[1]}
                      {parts[2]}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-white/8 pt-3 flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">{tier.name}</span>
              <span className="text-gray-300">×{quantity}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-gray-300">${subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Service fee</span>
              <span className="text-gray-300">${serviceFee}</span>
            </div>

            <div className="flex justify-between border-t border-white/8 pt-2 mt-1">
              <span className="text-white">Total</span>
              <span className="text-orange-400">${total}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default OrderSummary;
