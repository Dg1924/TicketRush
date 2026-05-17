export const TIER_COLORS = [
  {
    bg: "#ef4444",
    border: "#f87171",
    light: "bg-red-600/20 text-red-300 border-red-500/30",
  },
  {
    bg: "#2563eb",
    border: "#60a5fa",
    light: "bg-blue-600/20 text-blue-300 border-blue-500/30",
  },
  {
    bg: "#16a34a",
    border: "#4ade80",
    light: "bg-green-600/20 text-green-300 border-green-500/30",
  },
  {
    bg: "#f59e0b",
    border: "#fbbf24",
    light: "bg-amber-600/20 text-amber-300 border-amber-500/30",
  },
  {
    bg: "#9333ea",
    border: "#c084fc",
    light: "bg-purple-600/20 text-purple-300 border-purple-500/30",
  },
];

export const getTierColor = (index: number) => {
  return TIER_COLORS[index % TIER_COLORS.length];
};