import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className, "mt-14")}>
      <div className="container items-center py-10 text-center md:flex-row">
        ©{new Date().getFullYear()} Loggrr is an{" "}
        <Link
          href="https://axioned.com"
          target="_blank"
          className="underline hover:no-underline"
          title="Visit axioned.com"
        >
          Axioned
        </Link>{" "}
        product.
      </div>
    </footer>
  );
}
