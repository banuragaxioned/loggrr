import * as React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:flex-row">
        <p>
          ©{new Date().getFullYear()} Loggr is an{" "}
          <Link href={"https://axioned.com"} target="_blank">
            Axioned
          </Link>{" "}
          product.
        </p>
        <p>Made with ❤️ in India.</p>
      </div>
    </footer>
  );
}
