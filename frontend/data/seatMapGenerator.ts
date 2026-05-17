import type { Event } from "./events";
import type { SeatMapConfig, SeatRowConfig } from "../store/AppContext";

const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const buildDisabledSeats = (seats: number, mode: "center" | "side" | "none") => {
  if (mode === "none") return [];

  const disabled: number[] = [];

  if (mode === "center" && seats >= 12) {
    const mid = Math.ceil(seats / 2);
    disabled.push(mid, mid + 1);
  }

  if (mode === "side" && seats >= 14) {
    disabled.push(1, seats);
  }

  return disabled;
};

export function generateDefaultSeatMap(event: Event): SeatMapConfig {
  const rows: SeatRowConfig[] = [];
  let rowIndex = 0;

  const sortedTiers = [...event.tiers].sort(
    (a, b) => Number(b.price || 0) - Number(a.price || 0)
  );

  sortedTiers.forEach((tier, tierIndex) => {
    const price = Number(tier.price || 0);

    let rowCount = 3;
    let baseSeats = 12;

    if (tierIndex === 0) {
      rowCount = 4;
      baseSeats = 10;
    } else if (tierIndex === 1) {
      rowCount = 5;
      baseSeats = 14;
    } else {
      rowCount = 6;
      baseSeats = 18;
    }

    const maxRowsByCapacity = Math.max(
      1,
      Math.ceil(Number(tier.available || tier.capacity || 0) / baseSeats)
    );

    rowCount = Math.min(rowCount, maxRowsByCapacity, 8);

    for (let i = 0; i < rowCount && rowIndex < LABELS.length; i++) {
      const rowLabel = LABELS[rowIndex];

      let seats = baseSeats;

      if (event.category === "concert" || event.category === "festival") {
        seats = baseSeats + Math.min(i, 4) * 2;
      }

      if (event.category === "theater" || event.category === "comedy") {
        seats = baseSeats + Math.min(rowIndex, 6);
      }

      if (event.category === "sports") {
        seats = baseSeats + 4;
      }

      const disabled =
        event.category === "concert" || event.category === "festival"
          ? buildDisabledSeats(seats, tierIndex === 0 ? "none" : "center")
          : buildDisabledSeats(seats, "side");

      rows.push({
        id: `row-${rowLabel}`,
        label: rowLabel,
        seats,
        tierId: String(tier.id),
        disabled,
      });

      rowIndex++;
    }
  });

  const stageNames: Record<string, string> = {
    sports: "FIELD / COURT",
    theater: "STAGE",
    concert: "LIVE STAGE",
    festival: "MAIN STAGE",
    comedy: "STAGE",
  };

  return {
    eventId: String(event.id),
    stageName: stageNames[event.category] ?? "STAGE",
    rows,
  };
}