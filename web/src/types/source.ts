export const sources = {
  Pagibig: "pagibig",
  Secbank: "secbank",
} as const;

export type Source = keyof typeof sources;
