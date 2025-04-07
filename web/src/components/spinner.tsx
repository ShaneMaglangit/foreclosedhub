import * as React from "react";
import {forwardRef, HTMLAttributes} from "react";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@web/lib/utils";

const spinnerVariants = cva(
    "inline animate-spin",
    {
        variants: {
            variant: {
                default: "text-primary",
            },
            size: {
                default: "h-8 w-8",
                sm: "h-6 w-6",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        },
    }
)

export interface SpinnerProps
    extends HTMLAttributes<SVGSVGElement>,
        VariantProps<typeof spinnerVariants> {
}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
    ({className, variant, ...props}, ref) => {
        return (
            <svg
                ref={ref}
                role="status"
                className={cn(spinnerVariants({variant, className}))}
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
        )
    }
)
Spinner.displayName = "Spinner"

export {Spinner, spinnerVariants}