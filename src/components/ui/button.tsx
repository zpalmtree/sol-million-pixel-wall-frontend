import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-gray-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-black hover:text-primary border border-primary disabled:text-gray-400", 
  {
    variants: {
      variant: {
        default: "bg-gray-50 text-gray-900 hover:bg-gray-50/90",
        destructive: "bg-red-900 text-gray-50 hover:bg-red-900/90",
        outline: "border border-gray-800 bg-gray-950 hover:bg-gray-800 hover:text-gray-50",
        secondary: "bg-gray-800 text-gray-50 hover:bg-gray-800/80",
        ghost: "hover:bg-gray-800 hover:text-gray-50",
        link: "text-gray-50 underline-offset-4 hover:underline",
        transparent: "text-white hover:text-primary border border-primary inline-flex h-9 items-center justify-center rounded-md bg-[#1A1A1A] px-4 py-2 text-sm font-medium shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
        brown: "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#1A1A1A] shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 dark:bg-primary dark:text-[#1A1A1A] dark:hover:bg-primary/90 dark:focus-visible:ring-primary mt-4 hover:text-black"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
