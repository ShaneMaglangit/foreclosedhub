import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
} from "react";
import { cn } from "web/util";
import { clsx } from "clsx";
import { ButtonColor, ButtonVariant } from "web/components/button/types";

const baseStyle = clsx(
  "inline-flex items-center justify-center gap-1 rounded-md disabled:opacity-50",
  "truncate font-medium",
  "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1 cursor-pointer disabled:pointer-events-none",
);

const colorStyles = {
  default: {
    default:
      "text-black hover:bg-gray-150 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800",
    text: "text-black hover:bg-gray-150 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800",
  },
  primary: {
    default: "bg-primary-500 text-white hover:bg-primary-800",
    text: "text-primary-500 hover:bg-primary-50",
  },
  danger: {
    default: "bg-danger-500 text-white hover:bg-danger-800",
    text: "text-danger-500 hover:bg-danger-50",
  },
} satisfies Record<ButtonColor, Record<ButtonVariant, string>>;

const activeStyles = {
  default: {
    default: "bg-gray-150 dark:bg-gray-800",
    text: "bg-gray-150 dark:bg-gray-800",
  },
  primary: {
    default: "bg-primary-800",
    text: "bg-primary-50",
  },
  danger: {
    default: "bg-danger-800",
    text: "bg-danger-50",
  },
} satisfies Record<ButtonColor, Record<ButtonVariant, string>>;

type ButtonProps = {
  color?: ButtonColor;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
} & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" })
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { as: "link"; active?: boolean })
);

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      className,
      color = "default",
      variant = "default",
      children,
      startIcon,
      endIcon,
      ...props
    },
    ref,
  ) {
    const classes = cn(
      baseStyle,
      colorStyles[color][variant],
      clsx("h-9 px-3 py-1", {
        // Reducing horizontal padding keeps the visual weight of the button balanced.
        ["pl-2"]: startIcon,
        ["pr-2"]: endIcon,
        [activeStyles[color][variant]]: props.as === "link" && props.active,
      }),
      className,
    );

    if (props.as === "link") {
      return (
        <a ref={ref} className={classes} {...props}>
          <ButtonContent startIcon={startIcon} endIcon={endIcon}>
            {children}
          </ButtonContent>
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        <ButtonContent startIcon={startIcon} endIcon={endIcon}>
          {children}
        </ButtonContent>
      </button>
    );
  },
);

function ButtonContent({
  children,
  startIcon,
  endIcon,
}: Pick<ButtonProps, "children" | "startIcon" | "endIcon">) {
  return (
    <>
      {startIcon}
      {children}
      {endIcon}
    </>
  );
}
