import * as React from "react";
import { cn } from "@/utils/helper";
import { UseFormRegister } from "react-hook-form";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, register, name, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
          className
        )}
        // {...register(name!)}
        {...props}
        ref={ref}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
