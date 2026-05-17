export interface TicketTier {
  id: string | number; // Chấp nhận cả string từ mock và number từ MySQL
  name: string;
  price: number;
  capacity?: number;   // Thêm trường này để đồng bộ với Database
  available: number;
  description: string;
}

export interface Event {
  id: string | number;
  title: string;
  artist: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  image: string;
  featured: boolean;
  tags: string[];
  description: string;
  tiers: TicketTier[];
  minPrice?: number; 
  seat_map_config?: string;
  hasConfig?: number | boolean;
}

export const EVENTS: Event[] = [
  {
    id: "evt-001",
    title: "Neon Pulse World Tour",
    artist: "The Midnight Echo",
    category: "concert",
    date: "May 15, 2026",
    time: "8:00 PM",
    venue: "Madison Square Garden",
    city: "New York, NY",
    image: "/images/evt-001.jpg",
    featured: true,
    tags: ["Alternative", "Indie", "Electronic"],
    description: "Experience an unforgettable night as The Midnight Echo brings their Neon Pulse World Tour to New York City. Featuring stunning visual displays, chart-topping hits, and surprise guests.",
    tiers: [
      { id: "t1", name: "General Admission", price: 49, available: 450, description: "Standing floor access" },
      { id: "t2", name: "Reserved Seating", price: 89, available: 220, description: "Assigned seats with great views" },
      { id: "t3", name: "VIP Package", price: 199, available: 45, description: "Front section + meet & greet pass" },
      { id: "t4", name: "Platinum", price: 349, available: 12, description: "Backstage access + exclusive merch" },
    ],
  },
  {
    id: "evt-002",
    title: "NBA Finals Game 5",
    artist: "Lakers vs. Celtics",
    category: "sports",
    date: "June 8, 2026",
    time: "7:30 PM",
    venue: "Crypto.com Arena",
    city: "Los Angeles, CA",
    image: "/images/evt-002.jpg",
    featured: true,
    tags: ["NBA", "Basketball", "Playoffs"],
    description: "Witness history in the making as the Lakers and Celtics battle it out in Game 5 of the NBA Finals. The stakes have never been higher in this legendary rivalry.",
    tiers: [
      { id: "t1", name: "Upper Level", price: 120, available: 800, description: "Upper bowl seating" },
      { id: "t2", name: "Lower Level", price: 280, available: 310, description: "Lower bowl prime views" },
      { id: "t3", name: "Courtside", price: 1200, available: 18, description: "Courtside floor seats" },
    ],
  },
  {
    id: "evt-003",
    title: "Swan Lake — Reimagined",
    artist: "Royal Ballet Company",
    category: "theater",
    date: "May 28, 2026",
    time: "7:00 PM",
    venue: "Lincoln Center",
    city: "New York, NY",
    image: "/images/evt-003.jpg",
    featured: false,
    tags: ["Ballet", "Classical", "Arts"],
    description: "The Royal Ballet Company presents a breathtaking modern reimagining of Tchaikovsky's Swan Lake, blending classical technique with contemporary choreography.",
    tiers: [
      { id: "t1", name: "Balcony", price: 55, available: 180, description: "Third tier balcony seats" },
      { id: "t2", name: "Mezzanine", price: 95, available: 120, description: "Second tier mezzanine" },
      { id: "t3", name: "Orchestra", price: 145, available: 60, description: "Premium orchestra seating" },
    ],
  },
  {
    id: "evt-004",
    title: "Laugh Factory Live",
    artist: "Dave Chappelle & Friends",
    category: "comedy",
    date: "May 22, 2026",
    time: "9:00 PM",
    venue: "The Comedy Store",
    city: "Los Angeles, CA",
    image: "/images/evt-004.jpg",
    featured: false,
    tags: ["Comedy", "Stand-Up", "Live"],
    description: "An unforgettable night of laughs with Dave Chappelle headlining alongside surprise comedian friends. Prepare for an evening of boundary-pushing humor.",
    tiers: [
      { id: "t1", name: "General", price: 65, available: 200, description: "General seating" },
      { id: "t2", name: "Premium", price: 120, available: 80, description: "Front rows with 2 drinks included" },
    ],
  },
  {
    id: "evt-005",
    title: "Solaris Music Festival",
    artist: "50+ Artists",
    category: "festival",
    date: "July 4–6, 2026",
    time: "All Day",
    venue: "Grant Park",
    city: "Chicago, IL",
    image: "/images/evt-005.jpg",
    featured: true,
    tags: ["Multi-Genre", "Outdoor", "3 Days"],
    description: "Chicago's biggest summer festival returns with 50+ artists across 6 stages over 3 incredible days. Featuring food vendors, art installations, and unforgettable memories.",
    tiers: [
      { id: "t1", name: "1-Day Pass", price: 89, available: 2000, description: "Single day access" },
      { id: "t2", name: "3-Day Pass", price: 199, available: 800, description: "Full weekend access" },
      { id: "t3", name: "VIP Weekend", price: 449, available: 150, description: "VIP area + viewing platform + lounge" },
    ],
  },
  {
    id: "evt-006",
    title: "Voltage — Electric Nights",
    artist: "DJ Nexus",
    category: "concert",
    date: "June 14, 2026",
    time: "10:00 PM",
    venue: "Exchange LA",
    city: "Los Angeles, CA",
    image: "/images/evt-006.jpg",
    featured: false,
    tags: ["Electronic", "EDM", "House"],
    description: "DJ Nexus brings his legendary Voltage show to LA for one night only. Expect relentless energy, world-class production, and a crowd of thousands losing themselves in the music.",
    tiers: [
      { id: "t1", name: "General", price: 35, available: 1200, description: "Dance floor access" },
      { id: "t2", name: "VIP Table", price: 180, available: 30, description: "Private table + bottle service" },
    ],
  },
  {
    id: "evt-007",
    title: "Champions League Final",
    artist: "Real Madrid vs. Man City",
    category: "sports",
    date: "May 31, 2026",
    time: "3:00 PM",
    venue: "Wembley Stadium",
    city: "London, UK",
    image: "/images/evt-007.jpg",
    featured: false,
    tags: ["UEFA", "Football", "Final"],
    description: "The biggest club football match on the planet. Real Madrid vs. Manchester City in the UEFA Champions League Final at the iconic Wembley Stadium.",
    tiers: [
      { id: "t1", name: "Category 3", price: 220, available: 500, description: "Upper tier seating" },
      { id: "t2", name: "Category 2", price: 380, available: 200, description: "Mid-tier great views" },
      { id: "t3", name: "Category 1", price: 650, available: 80, description: "Premium sideline seats" },
    ],
  },
];
