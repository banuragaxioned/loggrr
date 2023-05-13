import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/helper";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground border border-border",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover focus:ring-secondary-ring",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover focus:ring-destructive-ring",
        success: "bg-success text-success-foreground hover:bg-success-hover focus:ring-success-ring",
        outline: "bg-transparent border border-border hover:bg-zinc-100 dark:text-zinc-100",
        subtle: "bg-muted text-muted-foreground hover:bg-zinc-200",
        ghost:
          "hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent focus:ring-transparent focus:outline-0",
        link: "bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-zinc-950 dark:text-zinc-100 hover:bg-transparent dark:hover:bg-transparent",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

export { Button, buttonVariants };
