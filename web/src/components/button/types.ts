export const buttonColors = ["default", "primary", "danger"] as const;
export type ButtonColor = (typeof buttonColors)[number];

export const buttonVariants = ["default", "text"] as const;
export type ButtonVariant = (typeof buttonVariants)[number];
