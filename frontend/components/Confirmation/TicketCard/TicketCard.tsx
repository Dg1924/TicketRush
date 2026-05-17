"use client";

import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import type { Event, TicketTier } from "@/data/events";
import QRCode from "../QRCode/QRCode";

type Props = {
  event: Event;
  tier: TicketTier;
  quantity: number;
  seatIds: string[];
  orderId: string;
  buyerName?: string;
};

const TicketCard = ({
  event,
  tier,
  quantity,
  seatIds,
  orderId,
  buyerName,
}: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-[#12121e] border border-white/10 rounded-3xl overflow-hidden mb-6"
    >
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-40 object-cover"
      />

      <div className="relative flex items-center">
        <div className="w-5 h-5 rounded-full bg-[#08080f] -ml-2.5 border-r border-white/10" />
        <div className="flex-1 border-t border-dashed border-white/20" />
        <div className="w-5 h-5 rounded-full bg-[#08080f] -mr-2.5 border-l border-white/10" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-orange-400 text-xs mb-0.5">{event.artist}</p>
            <h3 className="text-white">{event.title}</h3>
          </div>

          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
            Confirmed ✓
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Date & Time</p>
            <p className="text-white text-sm">{event.date}</p>
            <p className="text-gray-400 text-xs">{event.time}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-0.5">Venue</p>
            <p className="text-white text-sm">{event.venue}</p>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.city}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-0.5">Ticket Type</p>
            <p className="text-white text-sm">{tier.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-0.5">Quantity</p>
            <p className="text-white text-sm">
              {quantity} ticket{quantity > 1 ? "s" : ""}
            </p>
          </div>

          {buyerName && (
            <div className="col-span-2">
              <p className="text-gray-500 text-xs mb-0.5">Ticket Holder</p>
              <p className="text-white text-sm">{buyerName}</p>
            </div>
          )}
        </div>

        {seatIds.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">Your Seats</p>

            <div className="flex flex-wrap gap-1.5">
              {seatIds.map((seatId) => {
                const parts = seatId.split("_");

                return (
                  <span
                    key={seatId}
                    className="bg-orange-500/20 text-orange-300 border border-orange-500/20 text-xs px-2.5 py-1 rounded-full"
                  >
                    Row {parts[1]} · Seat {parts[2]}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center py-4 border-t border-white/10">
          <QRCode seed={orderId} />
          <p className="text-gray-400 text-xs mt-3">Scan at venue entrance</p>
          <p className="text-gray-600 text-xs font-mono mt-1">{orderId}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketCard;
