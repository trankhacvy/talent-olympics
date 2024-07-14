import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { forwardRefWithAs } from "@/utils/render"

import { cn } from "@/utils/cn"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  startDecorator?: React.ReactNode
  endDecorator?: React.ReactNode
  loading?: boolean
}

export const Button = forwardRefWithAs<"button", ButtonProps>(
  (
    {
      as: Tag = "button",
      className,
      variant,
      loading,
      fullWidth,
      size,
      children,
      startDecorator,
      endDecorator,
      disabled: disabledProp,
      ...props
    },
    ref
  ) => {
    const disabled = disabledProp || loading

    if (loading) {
      startDecorator = (
        <svg
          fill="currentColor"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-spin text-xl"
        >
          <g>
            <path d="M8,1V2.8A5.2,5.2,0,1,1,2.8,8H1A7,7,0,1,0,8,1Z" />
          </g>
        </svg>
      )
    }

    return (
      <Tag
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {startDecorator && <span className="btn-icon mr-2">{startDecorator}</span>}
        {children}
        {endDecorator && <span className="btn-icon ml-2">{endDecorator}</span>}
      </Tag>
    )
  }
)
