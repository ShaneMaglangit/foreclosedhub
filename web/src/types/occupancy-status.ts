export const occupancyStatuses = {
  Occupied: "occupied",
  Unoccupied: "unoccupied",
  Unknown: "unknown",
} as const;

export type OccupancyStatus = keyof typeof occupancyStatuses;
