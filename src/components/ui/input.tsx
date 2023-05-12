import * as React from "react";
import { cn } from "@/lib/helper";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-primary px-3 py-2 text-sm text-primary-foreground placeholder:opacity-75 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
        className
      )}
      {...props}
      ref={ref}
    />
  );
});
Input.displayName = "Input";

export { Input };
