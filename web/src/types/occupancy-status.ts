export const occupancyStatuses = {
  Occupied: "occupied",
  Unoccupied: "unoccupied",
  Unspecified: "unspecified",
} as const;

export type OccupancyStatus = keyof typeof occupancyStatuses;
