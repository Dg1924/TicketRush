import type { Event } from "@/data/events";
import FeaturedBanner from "../FeaturedBanner/FeaturedBanner";
import FeaturedEventTabs from "../FeaturedEventTabs/FeaturedEventTabs";

type Props = {
  events: Event[];
  activeIndex: number;
  onChange: (index: number) => void;
};

const FeaturedEvents = ({ events, activeIndex, onChange }: Props) => {
  if (!events.length) return null;

  return (
    <section className="mb-8">
      <div className="grid md:grid-cols-3 gap-4 mb-2">
        <div className="md:col-span-2">
          <FeaturedBanner event={events[activeIndex]} />
        </div>

        <FeaturedEventTabs
          events={events}
          activeIndex={activeIndex}
          onChange={onChange}
        />
      </div>
    </section>
  );
};

export default FeaturedEvents;
