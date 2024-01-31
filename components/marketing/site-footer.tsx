import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container items-center py-10 text-center md:flex-row">
        ©{new Date().getFullYear()} Loggr is an{" "}
        <Link href={"https://axioned.com"} target="_blank">
          Axioned
        </Link>{" "}
        product.
      </div>
    </footer>
  );
}
