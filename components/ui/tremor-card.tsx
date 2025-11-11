// Tremor Card [v0.0.2]

import React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, asChild, ...props }, forwardedRef) => {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      ref={forwardedRef}
      className={cn(
        // base
        "relative w-full rounded-lg border p-6 text-left shadow-sm",
        // background color
        "bg-card text-card-foreground",
        // border color
        "border-border",
        className,
      )}
      tremor-id="tremor-raw"
      {...props}
    />
  );
});

Card.displayName = "Card";

export { Card, type CardProps };
