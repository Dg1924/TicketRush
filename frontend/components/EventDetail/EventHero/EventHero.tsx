"use client";

import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

type EventHeroProps = {
  event: {
    image: string;
    title?: string;
  };
  liked: boolean;
  onLike: () => void;
};

const EventHero = ({ event, liked, onLike }: EventHeroProps) => {
  const router = useRouter();

  return (
    <div className="relative h-72 overflow-hidden">
      {/* Đã thay thẻ Image của NextJS bằng thẻ img thuần */}
      <img
        src={event.image}
        alt={event.title || "Event image"}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x600?text=No+Image"; }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] to-transparent" />

      <div className="absolute left-4 right-4 top-4 flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onLike} 
            aria-label="Like event"
            className="bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
          >
            <Heart
              size={20}
              className={liked ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>

          <button 
            type="button" 
            aria-label="Share event"
            className="bg-black/30 p-2 rounded-full hover:bg-black/50 transition"
          >
            <Share2 size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventHero;