export const occupancyStatuses = {
  Occupied: "occupied",
  Unoccupied: "unoccupied",
  Unspecified: "unknown",
} as const;

export type OccupancyStatus = keyof typeof occupancyStatuses;
