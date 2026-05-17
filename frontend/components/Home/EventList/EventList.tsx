import type { Event } from "@/data/events";
import EventCard from "../EventCard/EventCard";

type Props = {
  events: Event[];
};

const EventList = ({ events }: Props) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">🎭</div>
        <h3 className="text-white mb-2">No events found</h3>
        <p className="text-gray-400 text-sm">
          Try adjusting your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </section>
  );
};

export default EventList;
