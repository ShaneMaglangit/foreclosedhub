import {SpinnerColor, SpinnerSize} from "web/components/spinner/types";
import {forwardRef, HTMLAttributes} from "react";
import {cn} from "web/util";

const baseStyle = "inline animate-spin";

const colorStyles = {
    default: "text-black dark:text-white",
    primary: "text-primary-500",
    danger: "text-danger-500",
    light: "text-white",
} satisfies Record<SpinnerColor, string>;

const sizeStyles = {
    default: "h-8 w-8",
    small: "h-6 w-6",
} satisfies Record<SpinnerSize, string>;

type SpinnerProps = HTMLAttributes<SVGSVGElement> & {
    color?: SpinnerColor;
    size?: SpinnerSize;
};

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(function Button(
    {color = "default", size = "default", className, ...props},
    ref,
) {
    return (
        <svg
            ref={ref}
            role="status"
            className={cn(baseStyle, colorStyles[color], sizeStyles[size], className)}
            aria-hidden="true"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <title>Loading</title>
            <circle
                className="opacity-25"
                cx="24"
                cy="24"
                r="16"
                stroke="currentColor"
                strokeWidth="8"
            />
            <circle
                className="animate-writhe opacity-75"
                cx="24"
                cy="24"
                r="16"
                strokeLinecap="round"
                stroke="currentColor"
                strokeWidth="8"
            />
        </svg>
    );
});