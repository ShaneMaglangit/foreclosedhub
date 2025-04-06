import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@web/lib/utils"
import {clsx} from "clsx";
import {ButtonHTMLAttributes, forwardRef} from "react";

const buttonVariants = cva(
    clsx(
        "inline-flex items-center justify-center gap-1 rounded-md disabled:opacity-50",
        "truncate font-medium",
        "focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1 cursor-pointer disabled:pointer-events-none"
    ),
    {
        variants: {
            variant: {
                default: "text-black bg-bg hover:bg-gray-150 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800",
                primary: "bg-primary-500 text-white hover:bg-primary-800",
                danger: "bg-danger-500 text-white hover:bg-danger-800",
            },
            size: {
                default: "h-9 px-3 py-1",
                icon: "h-9 w-9",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export {Button, buttonVariants}