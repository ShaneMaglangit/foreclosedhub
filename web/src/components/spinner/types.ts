export const spinnerColors = ["default", "primary", "danger", "light"] as const;
export type SpinnerColor = (typeof spinnerColors)[number];

export const spinnerSizes = ["default", "small"] as const;
export type SpinnerSize = (typeof spinnerSizes)[number];